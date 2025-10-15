import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const DELAY_BETWEEN_REQUESTS = 3000; // 3 seconds
const MAX_CONSECUTIVE_FAILURES = 50;
const BLOCK_COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
];

// Keywords that typically indicate non-games
const NON_GAME_KEYWORDS = [
  // Demos and trials
  'demo', 'trial', 'test', 'preview', 'beta', 'alpha',
  
  // Trailers and media
  'trailer', 'video', 'movie', 'cinematic', 'cutscene',
  
  // DLC and expansions
  'dlc', 'expansion', 'addon', 'pack', 'bundle',
  
  // Software and tools
  'editor', 'creator', 'tool', 'sdk', 'kit', 'mod',
  
  // Content types
  'soundtrack', 'ost', 'music', 'artbook', 'guide', 'manual',
  
  // Platform/tech
  'steam', 'workshop', 'source', 'unity', 'unreal',
  
  // Status indicators
  'removed', 'delisted', 'discontinued', 'obsolete',
  
  // Common patterns
  'test_', '_test', '_demo', '_trailer', '_dlc'
];

// Check if app name suggests it's not a game
function isLikelyNonGame(appName: string): boolean {
  const name = appName.toLowerCase();
  
  // Check for exact keyword matches
  for (const keyword of NON_GAME_KEYWORDS) {
    if (name.includes(keyword)) {
      return true;
    }
  }
  
  // Check for patterns that suggest non-games
  const patterns = [
    /demo$/i,           // ends with "demo"
    /trailer$/i,        // ends with "trailer"
    /dlc$/i,            // ends with "dlc"
    /soundtrack$/i,     // ends with "soundtrack"
    /^test/i,           // starts with "test"
    /^steam/i,          // starts with "steam"
    /\s+demo\s+/i,      // contains " demo "
    /\s+trailer\s+/i,   // contains " trailer "
    /\s+dlc\s+/i,       // contains " dlc "
  ];
  
  for (const pattern of patterns) {
    if (pattern.test(name)) {
      return true;
    }
  }
  
  return false;
}

// Database setup
const db = new Database('./SteamDream.db');

// Create tables
function setupDatabase() {
  console.log('[SETUP] Creating database tables...');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS steam_apps (
      appid INTEGER PRIMARY KEY,
      name TEXT,
      status TEXT DEFAULT 'pending',
      last_checked DATETIME,
      CHECK (status IN ('pending', 'checked', 'game', 'failed', 'not_game'))
    );

    CREATE TABLE IF NOT EXISTS steam_games (
      appid INTEGER PRIMARY KEY,
      name TEXT,
      type TEXT,
      extra_data TEXT,
      FOREIGN KEY (appid) REFERENCES steam_apps(appid)
    );

    CREATE INDEX IF NOT EXISTS idx_status ON steam_apps(status);
    CREATE INDEX IF NOT EXISTS idx_last_checked ON steam_apps(last_checked);
  `);

  console.log('[SETUP] Database tables ready');
}

// Fetch the full app list from Steam
async function fetchAppList() {
  console.log('[SETUP] Fetching Steam app list...');
  
  const count = db.prepare('SELECT COUNT(*) as count FROM steam_apps').get() as { count: number };
  
  if (count.count > 0) {
    console.log(`[SETUP] Found ${count.count} apps in database. Skipping app list fetch.`);
    return;
  }

  try {
    const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
    const data = await response.json();
    const apps = data.applist.apps;

    console.log(`[SETUP] Fetched ${apps.length} apps from Steam API`);
    
    // Insert apps in batches
    const insert = db.prepare('INSERT OR IGNORE INTO steam_apps (appid, name, status) VALUES (?, ?, ?)');
    const insertMany = db.transaction((apps: any[]) => {
      for (const app of apps) {
        insert.run(app.appid, app.name, 'pending');
      }
    });

    insertMany(apps);
    console.log(`[SETUP] Inserted ${apps.length} apps into database`);
  } catch (error) {
    console.error('[ERROR] Failed to fetch app list:', error);
    throw error;
  }
}

// Get a random User-Agent
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Format current timestamp
function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Fetch app details from Steam Store API
async function fetchAppDetails(appid: number, retryCount = 0): Promise<any> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
  
  const headers = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://store.steampowered.com/'
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { 
      headers,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const appData = data[appid];
    
    // Better handling of missing app data
    if (!appData) {
      return { success: false, error: 'App data not found in API response' };
    }
    
    // Return the actual Steam API response structure
    return appData;
    
  } catch (error: any) {
    // Exponential backoff for network errors
    if (retryCount < 3) {
      const backoffDelay = Math.pow(2, retryCount) * 1000;
      console.log(`[RETRY] AppID ${appid} failed, retrying in ${backoffDelay}ms...`);
      await sleep(backoffDelay);
      return fetchAppDetails(appid, retryCount + 1);
    }
    
    return { success: false, error: error.message };
  }
}

// Sleep utility
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Process a single app
async function processApp(appid: number, name: string): Promise<boolean> {
  // Quick filter: skip obvious non-games based on name
  if (isLikelyNonGame(name)) {
    const updateStmt = db.prepare(`
      UPDATE steam_apps 
      SET status = 'not_game', last_checked = CURRENT_TIMESTAMP 
      WHERE appid = ?
    `);
    updateStmt.run(appid);
    console.log(`[${timestamp()}] AppID ${appid} (${name}) → 🚫 SKIPPED (name filter)`);
    return true;
  }

  // Only make API call for apps that pass the name filter
  const result = await fetchAppDetails(appid);

  const updateStmt = db.prepare(`
    UPDATE steam_apps 
    SET status = ?, last_checked = CURRENT_TIMESTAMP 
    WHERE appid = ?
  `);

  if (!result.success) {
    // Check if it's a Steam API error vs network error
    if (result.error && result.error.startsWith('HTTP')) {
      // Network/HTTP error - retry later
      console.log(`[${timestamp()}] AppID ${appid} (${name}) → HTTP error: ${result.error} - will retry`);
      return false;
    } else {
      // Steam API says app doesn't exist or is private
      updateStmt.run('not_game', appid);
      console.log(`[${timestamp()}] AppID ${appid} (${name}) → not found/private`);
      return true;
    }
  }

  const appData = result;
  
  if (appData.type === 'game') {
    // Insert into steam_games
    const insertGame = db.prepare(`
      INSERT OR REPLACE INTO steam_games (appid, name, type, extra_data)
      VALUES (?, ?, ?, ?)
    `);
    
    insertGame.run(
      appid,
      appData.name,
      appData.type,
      JSON.stringify(appData)
    );

    updateStmt.run('game', appid);
    console.log(`[${timestamp()}] AppID ${appid} (${appData.name}) → ✅ GAME`);
    return true;
  } else {
    updateStmt.run('not_game', appid);
    console.log(`[${timestamp()}] AppID ${appid} (${name}) → type: ${appData.type}`);
    return true;
  }
}

// Main scraping loop
async function startScraping(options: { shuffle?: boolean; retryFailed?: boolean } = {}) {
  console.log('\n========================================');
  console.log('🎮 Steam Game Scraper Started');
  console.log('========================================\n');

  printStats();

  let consecutiveFailures = 0;
  
  while (true) {
    // Get next app to process
    const statusFilter = options.retryFailed ? "status IN ('pending', 'failed')" : "status = 'pending'";
    const orderClause = options.shuffle ? 'ORDER BY RANDOM()' : 'ORDER BY appid';
    
    const nextApp = db.prepare(`
      SELECT appid, name 
      FROM steam_apps 
      WHERE ${statusFilter}
      ${orderClause}
      LIMIT 1
    `).get() as { appid: number; name: string } | undefined;

    if (!nextApp) {
      console.log('\n✅ All apps have been processed!');
      printStats();
      break;
    }

    const success = await processApp(nextApp.appid, nextApp.name);

    if (success) {
      consecutiveFailures = 0;
    } else {
      consecutiveFailures++;
      
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.log('\n⚠️  RATE LIMIT DETECTED ⚠️');
        console.log(`[${timestamp()}] ${consecutiveFailures} consecutive failures detected.`);
        console.log(`[${timestamp()}] Sleeping for 2 hours to avoid IP block...`);
        console.log(`[${timestamp()}] Will resume at: ${new Date(Date.now() + BLOCK_COOLDOWN).toLocaleString()}\n`);
        
        await sleep(BLOCK_COOLDOWN);
        consecutiveFailures = 0;
        console.log(`[${timestamp()}] Resuming scraping...\n`);
      }
    }

    // Wait before next request
    await sleep(DELAY_BETWEEN_REQUESTS);

    // Print stats every 100 apps
    const processed = db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status != 'pending'").get() as { count: number };
    if (processed.count % 100 === 0) {
      printStats();
    }
  }
}

// Print statistics
function printStats() {
  const stats = {
    total: db.prepare('SELECT COUNT(*) as count FROM steam_apps').get() as { count: number },
    pending: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'pending'").get() as { count: number },
    games: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'game'").get() as { count: number },
    notGames: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status IN ('not_game', 'checked')").get() as { count: number },
    failed: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'failed'").get() as { count: number },
    skipped: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'not_game' AND last_checked IS NOT NULL").get() as { count: number }
  };

  console.log('\n========================================');
  console.log('📊 STATISTICS');
  console.log('========================================');
  console.log(`Total apps:      ${stats.total.count.toLocaleString()}`);
  console.log(`✅ Games found:  ${stats.games.count.toLocaleString()}`);
  console.log(`❌ Not games:    ${stats.notGames.count.toLocaleString()}`);
  console.log(`🚫 Name filtered: ${stats.skipped.count.toLocaleString()}`);
  console.log(`⏳ Pending:      ${stats.pending.count.toLocaleString()}`);
  console.log(`⚠️  Failed:       ${stats.failed.count.toLocaleString()}`);
  
  const processed = stats.total.count - stats.pending.count;
  const progress = stats.total.count > 0 ? ((processed / stats.total.count) * 100).toFixed(2) : '0.00';
  console.log(`📈 Progress:     ${progress}%`);
  console.log('========================================\n');
}

// Reset database (clear all statuses)
function resetDatabase() {
  console.log('[RESET] Clearing all statuses...');
  db.prepare("UPDATE steam_apps SET status = 'pending', last_checked = NULL").run();
  db.prepare("DELETE FROM steam_games").run();
  console.log('[RESET] Database reset complete');
  printStats();
}

// CLI handler
async function main() {
  const args = process.argv.slice(2);
  
  setupDatabase();

  if (args.includes('--reset')) {
    resetDatabase();
    return;
  }

  if (args.includes('--stats')) {
    printStats();
    return;
  }

  // Fetch app list if needed
  await fetchAppList();

  const options = {
    shuffle: args.includes('--shuffle'),
    retryFailed: args.includes('--retry-failed'),
    conservative: args.includes('--conservative') // New flag
  };

  if (args.includes('--resume') || args.length === 0) {
    console.log('[INFO] Starting/resuming scraper...');
    await startScraping(options);
  } else {
    console.log('Usage:');
    console.log('  npm run scrape              # Start/resume scraping');
    console.log('  npm run scrape --resume     # Explicitly resume from last state');
    console.log('  npm run scrape --reset      # Reset all statuses and start fresh');
    console.log('  npm run scrape --stats      # Show statistics only');
    console.log('  npm run scrape --shuffle    # Process apps in random order');
    console.log('  npm run scrape --retry-failed  # Also retry failed apps');
    console.log('  npm run scrape --conservative  # Disable name filtering (more conservative scraping)');
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n[SHUTDOWN] Shutting down gracefully...');
  printStats();
  db.close();
  process.exit(0);
});

// Run the script
main().catch(error => {
  console.error('[FATAL ERROR]', error);
  db.close();
  process.exit(1);
});

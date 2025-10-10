import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('./SteamDream.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    appid INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT,
    discount INTEGER DEFAULT 0,
    header_image TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    needs_update INTEGER DEFAULT 1  -- Flag for games needing updates
  );

  CREATE TABLE IF NOT EXISTS app_list (
    appid INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_games_discount ON games(discount DESC);
  CREATE INDEX IF NOT EXISTS idx_games_needs_update ON games(needs_update);
  CREATE INDEX IF NOT EXISTS idx_app_list_name ON app_list(name);
`);

// Prepared statements for better performance
const insertGame = db.prepare(`
  INSERT OR REPLACE INTO games (appid, name, price, discount, header_image, last_updated)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertAppListItem = db.prepare(`
  INSERT OR REPLACE INTO app_list (appid, name)
  VALUES (?, ?)
`);

const updateMetadata = db.prepare(`
  INSERT OR REPLACE INTO metadata (key, value, updated_at)
  VALUES (?, ?, ?)
`);

const getAllGames = db.prepare('SELECT * FROM games ORDER BY discount DESC');
const getGameByAppId = db.prepare('SELECT * FROM games WHERE appid = ?');
const searchAppList = db.prepare('SELECT * FROM app_list WHERE name LIKE ? LIMIT 20');
const getMetadata = db.prepare('SELECT * FROM metadata WHERE key = ?');

// Add this function after your database initialization
function cleanupNonGames() {
  console.log('Cleaning up non-game entries...');
  
  // Count before
  const before = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  console.log(`Database has ${before.count} entries`);
  
  // Remove entries that are clearly not games
  db.prepare(`
    DELETE FROM games 
    WHERE name = 'Unknown' 
       OR price = 'N/A'
  `).run();
  
  // Count after
  const after = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  console.log(`Removed ${before.count - after.count} non-game entries`);
  console.log(`${after.count} games remaining`);
}

// Call it once on startup (then remove this line after running once)
cleanupNonGames();

// Step 1: Update the full app list
async function updateAppList() {
  try {
    console.log('Fetching Steam app list...');
    const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v0002/');
    const data = await response.json() as any; // Add 'as any' here
    
    const apps = data.applist.apps;
    console.log(`Received ${apps.length} apps from Steam API`);
    
    // Use a transaction for bulk insert (much faster)
    const insertMany = db.transaction((apps: any[]) => {
      for (const app of apps) {
        insertAppListItem.run(app.appid, app.name);
      }
    });
    
    insertMany(apps);
    
    // Update metadata
    updateMetadata.run('app_list_last_updated', new Date().toISOString(), new Date().toISOString());
    
    console.log(`Updated app list: ${apps.length} games stored in database`);
    return apps;
  } catch (error) {
    console.error('Error fetching app list:', error);
  }
}

// Step 2: Update game details in batches
async function updateGameDetails(appIds: number[]) {
  const DELAY_MS = 5000;  // 10 seconds between EACH request
  
  let successCount = 0;
  let errorCount = 0;
  let rateLimitCount = 0;
  let noDataCount = 0;
  let dlcCount = 0;
  
  console.log(`Starting update for ${appIds.length} apps (one at a time)...`);
  
  // Process ONE app at a time (no batching)
  for (let i = 0; i < appIds.length; i++) {
    const appId = appIds[i];
    
    try {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      // Check for rate limiting
      if (response.status === 429) {
        console.warn(`\n🛑 Rate limited on app ${appId} (request ${i + 1}/${appIds.length})`);
        rateLimitCount++;
        
        // STOP immediately
        console.log(`Processed ${i} apps before hitting rate limit`);
        return { 
          successCount, 
          dlcCount, 
          noDataCount, 
          errorCount, 
          rateLimitCount, 
          hitRateLimit: true,
          processedCount: i 
        };
      }
      
      if (!response.ok) {
        errorCount++;
        console.log(`❌ HTTP ${response.status} for app ${appId}`);
        continue;
      }
      
      const data = await response.json() as any;
      
      if (data[appId]?.success === true && data[appId]?.data) {
        const gameData = data[appId].data;
        const type = gameData.type?.toLowerCase();
        
        // Only store actual games
        if (type === 'game') {
          insertGame.run(
            appId,
            gameData.name || 'Unknown',
            gameData.price_overview?.final_formatted || 'Free',
            gameData.price_overview?.discount_percent || 0,
            gameData.header_image || null,
            new Date().toISOString()
          );
          
          successCount++;
          console.log(`✅ [${i + 1}/${appIds.length}] Added: ${gameData.name}`);
        } else {
          dlcCount++;
          if (i % 10 === 0) {
            console.log(`⏭️  [${i + 1}/${appIds.length}] Filtered: ${type || 'unknown'}`);
          }
        }
      } else {
        noDataCount++;
      }
      
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Error on app ${appId}:`, error.message);
    }
    
    // Wait between EVERY request (not just batches)
    if (i < appIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
    
    // Progress summary every 20 apps
    if ((i + 1) % 20 === 0) {
      console.log(`\n📊 Progress: ${i + 1}/${appIds.length} | Games: ${successCount}, Filtered: ${dlcCount}\n`);
    }
  }
  
  console.log(`\nBatch complete: ${successCount} games, ${dlcCount} filtered, ${noDataCount} no data, ${errorCount} errors`);
  return { successCount, errorCount, rateLimitCount, dlcCount, noDataCount, hitRateLimit: false };
}

// Modified function to get games that need updating
function getGameIdsToUpdate(limit: number = 200): number[] {
  // Get games that were never updated OR are older than 7 days
  const gamesToUpdate = db.prepare(`
    SELECT appid FROM app_list 
    WHERE appid NOT IN (
      SELECT appid FROM games 
      WHERE last_updated > datetime('now', '-7 days')
    )
    LIMIT ?
  `).all(limit);
  
  return gamesToUpdate.map((row: any) => row.appid);
}

// Main update function - fetches progressively
async function updateGameData() {
  console.log('Starting scheduled game data update...');
  
  // 1. Update app list if it's old or empty
  const appListMeta = getMetadata.get('app_list_last_updated') as any;
  const shouldUpdateList = !appListMeta || 
    new Date(appListMeta.value) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days old
  
  if (shouldUpdateList) {
    await updateAppList();
  }
  
  // 2. Get next batch of games to update (200 games per run)
  const appIdsToUpdate = getGameIdsToUpdate(200);
  
  if (appIdsToUpdate.length === 0) {
    console.log('All games are up to date!');
    return;
  }
  
  console.log(`Found ${appIdsToUpdate.length} games needing updates`);
  
  // 3. Update details in batches
  const result = await updateGameDetails(appIdsToUpdate);
  
  // 4. Update metadata
  const totalUpdated = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  const totalGames = db.prepare('SELECT COUNT(*) as count FROM app_list').get() as any;
  const progress = ((totalUpdated.count / totalGames.count) * 100).toFixed(2);
  
  updateMetadata.run('games_last_updated', new Date().toISOString(), new Date().toISOString());
  updateMetadata.run('update_progress', `${progress}%`, new Date().toISOString());
  
  console.log(`Overall progress: ${totalUpdated.count}/${totalGames.count} games (${progress}%)`);
  console.log('Game data update complete!');
}

// Add this initialization function
async function initializeDatabase() {
  console.log('\n🚀 ====== DATABASE INITIALIZATION STARTED ======\n');
  
  console.log('Step 1: Fetching Steam app list...');
  await updateAppList();
  
  const totalApps = db.prepare('SELECT COUNT(*) as count FROM app_list').get() as any;
  console.log(`✅ Found ${totalApps.count} total apps on Steam\n`);
  
  console.log('Step 2: Fetching game details...\n');
  
  let totalProcessed = 0;
  let totalGamesAdded = 0;
  const startTime = Date.now();
  
  while (true) {
    const appIdsToUpdate = getGameIdsToUpdate(200); // Process 200 at a time
    
    if (appIdsToUpdate.length === 0) {
      console.log('\n✅ All apps have been processed!');
      break;
    }
    
    const result = await updateGameDetails(appIdsToUpdate);
    
    totalProcessed += appIdsToUpdate.length;
    totalGamesAdded += result.successCount || 0;
    
    // Calculate statistics
    const currentGames = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
    const progressPercent = ((totalProcessed / totalApps.count) * 100).toFixed(1);
    
    console.log(`\n📊 Apps checked: ${totalProcessed} / ${totalApps.count} (${progressPercent}%) | Total games: ${currentGames.count}\n`);
    
    // Handle rate limiting
    if (result.hitRateLimit) {
      console.log('⏸️  Pausing for 30 minutes due to rate limit...');
      console.log(`   (You can restart the server anytime to resume)\n`);
      await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000)); // 30 minutes
    } else {
      // Normal pause between batches (30 seconds)
      console.log('⏸️  Short break (30 seconds)...\n');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  const finalGames = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  const totalTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  
  console.log('\n🎉 ====== INITIALIZATION COMPLETE ======');
  console.log(`   Total apps processed: ${totalProcessed}`);
  console.log(`   Total games stored: ${finalGames.count}`);
  console.log(`   Time taken: ${totalTime} minutes`);
  console.log('========================================\n');
  
  updateMetadata.run('initialization_complete', 'true', new Date().toISOString());
  updateMetadata.run('games_last_updated', new Date().toISOString(), new Date().toISOString());
}

// Modified startup logic
(async () => {
  const initComplete = getMetadata.get('initialization_complete') as any;
  const totalApps = db.prepare('SELECT COUNT(*) as count FROM app_list').get() as any;
  const totalGames = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  
  console.log(`\n📊 Current database status:`);
  console.log(`   Total apps in list: ${totalApps.count}`);
  console.log(`   Games with details: ${totalGames.count}`);
  
  // Run initialization if:
  // 1. Never been initialized before, OR
  // 2. Database is mostly empty (less than 100 games)
  if (!initComplete || totalGames.count < 100) {
    console.log('\n⚡ Running initial database setup...\n');
    await initializeDatabase();
  } else {
    console.log('✅ Database already initialized');
    console.log('📅 Scheduled updates will run every 2 hours\n');
  }
})();

// Scheduled maintenance updates (runs after initialization)
cron.schedule('0 */2 * * *', async () => {
  const initComplete = getMetadata.get('initialization_complete') as any;
  
  // Only run maintenance if initialization is complete
  if (initComplete) {
    console.log('\n🔄 Running scheduled maintenance update...');
    
    // Update games that are older than 7 days
    const appIdsToUpdate = getGameIdsToUpdate(200);
    
    if (appIdsToUpdate.length > 0) {
      console.log(`Updating ${appIdsToUpdate.length} games...`);
      await updateGameDetails(appIdsToUpdate);
      updateMetadata.run('games_last_updated', new Date().toISOString(), new Date().toISOString());
      console.log('✅ Maintenance update complete\n');
    } else {
      console.log('✅ All games are up to date\n');
    }
  }
});

// Optional: Manual trigger endpoints
app.post('/api/admin/init', async (req, res) => {
  res.json({ message: 'Initialization started. Check server logs for progress.' });
  initializeDatabase().catch(err => console.error('Init error:', err));
});

app.post('/api/admin/reinit', async (req, res) => {
  // Force re-initialization
  db.prepare('DELETE FROM games').run();
  updateMetadata.run('initialization_complete', 'false', new Date().toISOString());
  res.json({ message: 'Database cleared. Restarting initialization...' });
  initializeDatabase().catch(err => console.error('Init error:', err));
});

// Add a manual trigger endpoint for testing
app.post('/api/admin/update', async (req, res) => {
  console.log('Manual update triggered');
  updateGameData(); // Run in background
  res.json({ message: 'Update started' });
});

// Add progress endpoint
app.get('/api/admin/progress', (req, res) => {
  const totalUpdated = db.prepare('SELECT COUNT(*) as count FROM games').get() as any;
  const totalGames = db.prepare('SELECT COUNT(*) as count FROM app_list').get() as any;
  const progress = ((totalUpdated.count / totalGames.count) * 100).toFixed(2);
  const lastUpdate = getMetadata.get('games_last_updated') as any;
  
  res.json({
    totalGames: totalGames.count,
    gamesWithDetails: totalUpdated.count,
    progressPercent: progress,
    lastUpdated: lastUpdate?.value || null,
    remaining: totalGames.count - totalUpdated.count
  });
});

// API Endpoints
app.get('/api/games', (req, res) => {
  try {
    const games = getAllGames.all();
    const meta = getMetadata.get('games_last_updated') as any;
    
    res.json({
      games,
      lastUpdated: meta?.value || null,
      totalGames: games.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/games/:appid', (req, res) => {
  try {
    const appId = parseInt(req.params.appid);
    const game = getGameByAppId.get(appId);
    
    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Fixed search endpoint (should use req.params, not req.query)
app.get('/api/games/search/:query', (req, res) => {
  try {
    const query = req.params.query; // This was the bug!
    const results = searchAppList.all(`%${query}%`);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get games with discounts
app.get('/api/games/discounts', (req, res) => {
  try {
    const discountedGames = db.prepare(
      'SELECT * FROM games WHERE discount > 0 ORDER BY discount DESC LIMIT 50'
    ).all();
    res.json(discountedGames);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

export default app;
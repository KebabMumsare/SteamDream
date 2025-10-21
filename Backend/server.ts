import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import session from 'express-session';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';


// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'SteamDream.db'));
console.log('✅ Database connected:', path.join(__dirname, 'SteamDream.db'));

// Create favorites table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    appid INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, appid)
  )
`);
console.log('✅ Favorites table initialized');

// Create user_preferences table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    color_scheme TEXT,
    font TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('✅ User preferences table initialized');

const app = express();

// Trust proxy for ngrok
app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Serve static files from Frontend/dist
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Session configuration - CRITICAL for passport-steam with ngrok
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key',
    name: 'sessionId',
    resave: true, // MUST be true for passport-steam
    saveUninitialized: true, // MUST be true for passport-steam
    cookie: {
      secure: false, // MUST be false for ngrok (even though it's https, it's proxied)
      httpOnly: true,
      sameSite: 'lax', // Important for OAuth redirects
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware - log all requests
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
    console.log(`\n📍 ${req.method} ${req.path}`);
    console.log(`   Session ID: ${req.sessionID}`);
    console.log(`   Authenticated: ${req.isAuthenticated()}`);
    if (req.user) {
      console.log(`   ✅ User logged in - Steam ID: ${(req.user as any).id}`);
    }
  }
  next();
});

// Configure Steam Strategy
passport.use(new SteamStrategy(
  {
    returnURL: `${process.env.BASE_URL}/auth/steam/return`,
    realm: `${process.env.BASE_URL}/`,
    apiKey: process.env.STEAM_API_KEY || '',
  },
  (identifier: string, profile: any, done: any) => {
    profile.identifier = identifier;
    return done(null, profile);
  }
));

// Serialize and deserialize user
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

// Auth Routes
app.get('/auth/steam', passport.authenticate('steam'));

app.get(
  '/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login - redirect to profile page
    const user = req.user as any;
    console.log('\n✅ ===== STEAM LOGIN SUCCESSFUL =====');
    console.log('Steam ID:', user.id);
    console.log('Display Name:', user.displayName);
    console.log('Full User Object:', JSON.stringify(user, null, 2));
    console.log('Session ID:', req.sessionID);
    console.log('=====================================\n');
    res.redirect('/profile');
  }
);

app.get('/auth/user', (req, res) => {
  console.log('\n🔍 /auth/user called');
  console.log('Is Authenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    const user = req.user as any;
    console.log('✅ User Steam ID:', user.id);
    console.log('Display Name:', user.displayName);
    res.json(req.user);
  } else {
    console.log('❌ Not authenticated');
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Basic routes
app.get('/api/status', (req, res) => res.json({ status: 'Backend running' }));

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/steam');
  res.send(`Welcome, ${(req.user as any).displayName}`);
});

// Steam API helper function
async function fetchSteamAPI(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Steam API fetch error:', error);
    throw error;
  }
}

// Steam API Routes - MUST be BEFORE the catch-all route
app.get('/api/steam/owned-games', async (req, res) => {
  console.log('\n📥 ===== FETCHING OWNED GAMES =====');
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log('Session ID:', req.sessionID);
  
  if (!req.isAuthenticated()) {
    console.log('❌ User NOT authenticated');
    console.log('==================================\n');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = req.user as any;
  // passport-steam stores the Steam ID in profile.id
  const steamId = user.id || user.steamid || user.steamId || user._json?.steamid;
  
  console.log('✅ User IS authenticated');
  console.log('User object keys:', Object.keys(user));
  console.log('Steam ID (user.id):', user.id);
  console.log('Steam ID (user.steamid):', user.steamid);
  console.log('Steam ID (user._json?.steamid):', user._json?.steamid);
  console.log('Using Steam ID:', steamId);
  
  if (!steamId) {
    console.log('❌ No Steam ID found in user object!');
    console.log('Full user object:', JSON.stringify(user, null, 2));
    console.log('==================================\n');
    return res.status(500).json({ error: 'Steam ID not found' });
  }
  
  const apiKey = process.env.STEAM_API_KEY;
  
  try {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;
    console.log('🌐 Calling Steam API for Steam ID:', steamId);
    
    const data = await fetchSteamAPI(url);
    const gameCount = data.response?.game_count || 0;
    
    console.log(`✅ SUCCESS! Fetched ${gameCount} games`);
    console.log('==================================\n');
    res.json(data.response);
  } catch (error) {
    console.error('❌ ERROR fetching games:', error);
    console.log('==================================\n');
    res.status(500).json({ error: 'Failed to fetch owned games' });
  }
});

// Get scraper statistics
app.get('/api/scraper/stats', (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM steam_games').get() as { count: number },
      games: db.prepare('SELECT COUNT(*) as count FROM steam_games').get() as { count: number }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get recent games
app.get('/api/scraper/recent-games', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const games = db.prepare(`
      SELECT appid, name, type 
      FROM steam_games 
      ORDER BY appid DESC 
      LIMIT ?
    `).all(limit);

    res.json(games);
  } catch (error) {
    console.error('Error fetching recent games:', error);
    res.status(500).json({ error: 'Failed to fetch recent games' });
  }
});

// Get game details
app.get('/api/scraper/game/:appid', (req, res) => {
  try {
    const appid = parseInt(req.params.appid);
    const game = db.prepare('SELECT * FROM steam_games WHERE appid = ?').get(appid) as any;

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Parse the JSON data if it exists
    if (game.extra_data) {
      try {
        game.extra_data = JSON.parse(game.extra_data);
      } catch (e) {
        console.error('Error parsing extra_data:', e);
      }
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

// Get all games with specific fields (name, price, discount, etc.)
app.get('/api/games', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    
    // First, get ALL games from the database (no LIMIT/OFFSET here)
    const allGames = db.prepare(`
      SELECT 
        appid,
        name,
        type,
        extra_data
      FROM steam_games 
      ORDER BY appid DESC
    `).all() as any[];

    // Parse extra_data JSON for each game and extract relevant fields
    const parsedGames = allGames.map(game => {
      let gameData: any = {
        appid: game.appid,
        name: game.name,
        type: game.type
      };

      try {
        if (game.extra_data && typeof game.extra_data === 'string') {
          const extraData = JSON.parse(game.extra_data);
          
          // Extract price information
          if (extraData.price_overview) {
            gameData.price_before_discount = extraData.price_overview.initial / 100; // Convert cents to dollars
            gameData.price_after_discount = extraData.price_overview.final / 100;
            gameData.discount_percent = extraData.price_overview.discount_percent;
          } else {
            gameData.price_after_discount = 0; // Free game
            gameData.discount_percent = 0;
          }
          
          // Extract other fields (use header_image like favorites endpoint)
          if (extraData.header_image) {
            gameData.image_url = extraData.header_image;
          }
          
          gameData.platforms = extraData.platforms || {};
          gameData.tags = extraData.genres?.map((g: any) => g.description) || [];
          gameData.categories = extraData.categories?.map((c: any) => c.description) || [];
          gameData.description = extraData.short_description || extraData.detailed_description || '';
        }
      } catch (e) {
        console.error(`Error parsing game ${game.appid}:`, e);
      }
      
      return gameData;
    });

    // Sort by discount percentage (highest first), then by appid as secondary sort
    parsedGames.sort((a, b) => {
      const discountA = a.discount_percent || 0;
      const discountB = b.discount_percent || 0;
      
      // If discounts are equal, sort by appid descending
      if (discountA === discountB) {
        return b.appid - a.appid;
      }
      
      // Sort by discount percentage descending (highest first)
      return discountB - discountA;
    });

    // Apply pagination AFTER sorting
    const paginatedGames = parsedGames.slice(offset, offset + limit);

    res.json({
      count: paginatedGames.length,
      total: parsedGames.length,
      games: paginatedGames
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// ===== FAVORITES ENDPOINTS =====

// Get user's favorites
app.get('/api/favorites', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;

    const favorites = db.prepare(`
      SELECT appid, created_at
      FROM favorites
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(steamId);

    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a favorite
app.post('/api/favorites', (req, res) => {
  console.log('\n➕ POST /api/favorites called');
  console.log('   Authenticated:', req.isAuthenticated());
  console.log('   Request body:', req.body);
  
  if (!req.isAuthenticated()) {
    console.log('   ❌ Not authenticated - returning 401');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;
    const { appid } = req.body;

    console.log('   Steam ID:', steamId);
    console.log('   App ID:', appid);

    if (!appid) {
      console.log('   ❌ Missing appid - returning 400');
      return res.status(400).json({ error: 'appid is required' });
    }

    // Insert favorite (UNIQUE constraint prevents duplicates)
    const result = db.prepare(`
      INSERT INTO favorites (user_id, appid)
      VALUES (?, ?)
    `).run(steamId, appid);

    console.log('   ✅ Favorite added successfully:', result);
    res.json({ success: true, message: 'Favorite added' });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      console.log('   ⚠️ Already in favorites');
      return res.status(409).json({ error: 'Already in favorites' });
    }
    console.error('   ❌ Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove a favorite
app.delete('/api/favorites/:appid', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;
    const { appid } = req.params;

    const result = db.prepare(`
      DELETE FROM favorites
      WHERE user_id = ? AND appid = ?
    `).run(steamId, appid);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Get favorite games with full details
app.get('/api/favorites/games', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;

    const favoriteGames = db.prepare(`
      SELECT 
        g.appid,
        g.name,
        g.type,
        g.extra_data,
        f.created_at as favorited_at
      FROM favorites f
      JOIN steam_games g ON f.appid = g.appid
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(steamId) as any[];

    // Parse extra_data JSON for each game
    const parsedGames = favoriteGames.map(game => {
      let gameData: any = {
        appid: game.appid,
        name: game.name,
        type: game.type,
        favorited_at: game.favorited_at
      };

      try {
        if (game.extra_data && typeof game.extra_data === 'string') {
          const extraData = JSON.parse(game.extra_data);
          
          // Extract price information (convert cents to dollars/euros - same as /api/games)
          if (extraData.price_overview) {
            gameData.price_before_discount = extraData.price_overview.initial / 100;
            gameData.price_after_discount = extraData.price_overview.final / 100;
            gameData.discount_percent = extraData.price_overview.discount_percent;
          } else {
            gameData.price_after_discount = 0; // Free game
            gameData.discount_percent = 0;
          }

          if (extraData.platforms) {
            gameData.platforms = extraData.platforms;
          }

          if (extraData.genres) {
            gameData.tags = extraData.genres.map((g: any) => g.description);
          }

          if (extraData.categories) {
            gameData.categories = extraData.categories.map((c: any) => c.description);
          }

          if (extraData.short_description) {
            gameData.description = extraData.short_description;
          }

          if (extraData.header_image) {
            gameData.image_url = extraData.header_image;
          }
        }
      } catch (e) {
        console.error(`Failed to parse extra_data for game ${game.appid}:`, e);
      }

      return gameData;
    });

    res.json({ games: parsedGames });
  } catch (error) {
    console.error('Error fetching favorite games:', error);
    res.status(500).json({ error: 'Failed to fetch favorite games' });
  }
});

// ===== USER PREFERENCES ENDPOINTS =====

// Get user preferences
app.get('/api/preferences', (req, res) => {
  console.log('\n⚙️ GET /api/preferences called');
  console.log('   Authenticated:', req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    console.log('   ❌ Not authenticated - returning 401');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;
    console.log('   Steam ID:', steamId);

    const preferences = db.prepare(`
      SELECT color_scheme, font, updated_at
      FROM user_preferences
      WHERE user_id = ?
    `).get(steamId) as any;

    if (!preferences) {
      console.log('   ℹ️ No preferences found - returning defaults');
      return res.json({ 
        preferences: null,
        message: 'No preferences saved yet'
      });
    }

    // Parse color_scheme JSON string back to object
    let colorScheme = null;
    if (preferences.color_scheme) {
      try {
        colorScheme = JSON.parse(preferences.color_scheme);
      } catch (e) {
        console.error('   ⚠️ Failed to parse color_scheme JSON:', e);
      }
    }

    console.log('   ✅ Preferences found:', { colorScheme, font: preferences.font });
    res.json({ 
      preferences: {
        colorScheme,
        font: preferences.font,
        updatedAt: preferences.updated_at
      }
    });
  } catch (error) {
    console.error('   ❌ Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update user preferences
app.put('/api/preferences', (req, res) => {
  console.log('\n💾 PUT /api/preferences called');
  console.log('   Authenticated:', req.isAuthenticated());
  console.log('   Request body:', req.body);
  
  if (!req.isAuthenticated()) {
    console.log('   ❌ Not authenticated - returning 401');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = req.user as any;
    const steamId = user.id;
    const { colorScheme, font } = req.body;

    console.log('   Steam ID:', steamId);
    console.log('   Color Scheme:', colorScheme);
    console.log('   Font:', font);

    // Convert colorScheme object to JSON string
    const colorSchemeJson = colorScheme ? JSON.stringify(colorScheme) : null;

    // Upsert preferences (insert or update)
    db.prepare(`
      INSERT INTO user_preferences (user_id, color_scheme, font, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) 
      DO UPDATE SET 
        color_scheme = excluded.color_scheme,
        font = excluded.font,
        updated_at = CURRENT_TIMESTAMP
    `).run(steamId, colorSchemeJson, font);

    console.log('   ✅ Preferences saved successfully');
    res.json({ success: true, message: 'Preferences saved' });
  } catch (error) {
    console.error('   ❌ Error saving preferences:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

// Serve React app for all other routes (must be last!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Public URL: ${process.env.BASE_URL}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  db.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});



export default app;
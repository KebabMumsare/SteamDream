import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import session from 'express-session';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Serve static files from Frontend/dist
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using https
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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
    res.redirect('/profile');
  }
);

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
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
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const steamId = (req.user as any).id;
  const apiKey = process.env.STEAM_API_KEY;
  
  try {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;
    const data = await fetchSteamAPI(url);
    res.json(data.response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch owned games' });
  }
});

// Get scraper statistics
/*app.get('/api/scraper/stats', (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM steam_apps').get() as { count: number },
      pending: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'pending'").get() as { count: number },
      games: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'game'").get() as { count: number },
      notGames: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status IN ('not_game', 'checked')").get() as { count: number },
      failed: db.prepare("SELECT COUNT(*) as count FROM steam_apps WHERE status = 'failed'").get() as { count: number }
    };

    const processed = stats.total.count - stats.pending.count;
    const progress = stats.total.count > 0 ? ((processed / stats.total.count) * 100).toFixed(2) : '0.00';

    res.json({ ...stats, progress: parseFloat(progress) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});*/

// Get recent games
/*app.get('/api/scraper/recent-games', (req, res) => {
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
    res.status(500).json({ error: 'Failed to fetch recent games' });
  }
}); */

// Get game details
/*app.get('/api/scraper/game/:appid', (req, res) => {
  try {
    const appid = parseInt(req.params.appid);
    const game = db.prepare('SELECT * FROM steam_games WHERE appid = ?').get(appid) as any;

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Parse the JSON data
    game.extra_data = JSON.parse(game.extra_data);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});*/

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
/*process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});*/

export default app;
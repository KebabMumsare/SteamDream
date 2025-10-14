import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import Database from 'better-sqlite3';
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
  db.close();
  process.exit(0);
});

export default app;
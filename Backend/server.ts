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
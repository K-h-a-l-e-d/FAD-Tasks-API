const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "db.sqlite");
const db = new Database(dbPath);

// WAL mode = better read/write performance, standard practice for SQLite.
db.pragma("journal_mode = WAL");

// Create tables if they don't already exist yet.
// This runs every time the app starts, but CREATE TABLE IF NOT EXISTS
// makes it safe to repeat — it won't wipe existing data.
db.exec(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL
  );`,
);

// Seed one login user, only if the users table is empty.
// Username: admin | Password: admin123
const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;

if (userCount == 0) {
  const passwordHash = bcrypt.hashSync("admin123", 8); // 8 is salt rounds / cost factor
  db.prepare("INSERT INTO users (username, passwordHash) VALUES (?, ?)").run(
    "admin",
    passwordHash,
  );
}

module.exports = db;

const db = require("../data/db");

// The Task model owns:
// - what a task looks like
// - how one gets created
// - how they get retrieved
// Controllers never touch SQL directly — they only call these functions.

// since SQLite has no boolean type "completed" is stored as 0/1.
// This converts it back to a real boolean before it reaches the client.
function formatTask(row) {
  return {
    ...row,
    completed: Boolean(row.completed),
  };
}

function findAll() {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY id ASC").all();
  return rows.map(formatTask);
}

function findById(id) {
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return row ? formatTask(row) : null;
}

function create({ title, description }) {
  const createdAt = new Date().toISOString();
  const cleanTitle = title.trim();
  const cleanDescription = description ? description.trim() : "";

  const result = db
    .prepare(
      "INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)",
    )
    .run(cleanTitle, cleanDescription, createdAt);

  return findById(result.lastInsertRowid);
}

module.exports = { findAll, findById, create };

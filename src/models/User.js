const bcrypt = require("bcryptjs");
const db = require("../data/db");

// The User model owns:
// - how to find a user
// - how to check a password against the stored hash

function findByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

function verifyPassword(user, plainPassword) {
  return bcrypt.compareSync(plainPassword, user.passwordHash);
}

module.exports = { findByUsername, verifyPassword };

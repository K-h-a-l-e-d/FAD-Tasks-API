const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /login
function login(req, res) {
  const { username, password } = req.body;

  const user = User.findByUsername(username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const isMatch = User.verifyPassword(user, password);

  if (!isMatch) {
    res.status(401).json({
      success: false,
      message: "Invalid username or password.",
    });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
  });
}

module.exports = { login };

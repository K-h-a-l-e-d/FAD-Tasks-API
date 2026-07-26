const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ success: true, message: "Tasks Manager API is running." });
});

module.exports = app;

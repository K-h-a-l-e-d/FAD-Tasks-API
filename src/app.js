const express = require("express");
const app = express();

const tasksRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Parse incoming JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Tasks Manager API is running." });
});

// Routes
app.use("/tasks", tasksRoutes);
app.use("/login", authRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;

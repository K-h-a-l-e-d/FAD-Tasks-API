const Task = require("../models/Task");

// GET /tasks
function getTasks(req, res) {
  const tasks = Task.findAll();

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
}

// POST /tasks
function createTask(req, res) {
  const { title, description } = req.body;

  const newTask = Task.create({ title, description });

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: newTask,
  });
}

module.exports = { getTasks, createTask };

# Simple Task Manager API

A simple RESTful API built with **Node.js**, **Express**, and **SQLite**.

## Features

- `GET /tasks` — Retrieve all tasks
- `POST /tasks` — Create a new task (with validation)
- `POST /login` — Authenticate a user and receive a JWT token

## Tech Stack

- Node.js
- Express
- SQLite (via `better-sqlite3`) — file-based database, no separate server setup required
- bcryptjs — password hashing
- jsonwebtoken — auth tokens

## Project Structure

```
task-manager-api/
├── server.js                 # Entry point — starts the server
├── src/
│   ├── app.js                 # Express app setup, middleware, route mounting
│   ├── routes/
│   │   ├── taskRoutes.js       # /tasks routes
│   │   └── authRoutes.js       # /login route
│   ├── controllers/
│   │   ├── taskController.js   # Task request/response handling
│   │   └── authController.js   # Login request/response handling
│   ├── models/
│   │   ├── Task.js             # Task data logic (create, findAll)
│   │   └── User.js             # User lookup + password verification
│   ├── middleware/
│   │   ├── validateTask.js     # Validates POST /tasks body
│   │   ├── validateLogin.js    # Validates POST /login body
│   │   └── errorHandler.js     # 404 + centralized error handling
│   └── data/
│       ├── db.js               # SQLite connection, schema, seed data
│       └── db.sqlite     # The database file (auto-created, gitignored)
├── screenshots/               # Postman testing screenshots
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Documentation

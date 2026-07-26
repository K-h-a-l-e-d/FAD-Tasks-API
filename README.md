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

## Postman Testing Screenshots

- `GET /`

- `GET /tasks`
- `POST /tasks` (success case)
- `POST /tasks` (validation error — missing title)
- `POST /login` (success case)
- `POST /login` (invalid credentials)

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

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd FAD-Tasks-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then open `.env` and set your own real `JWT_SECRET` (a long random string). You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run the server

```bash
npm start
```

Or with auto-restart during development:

```bash
npm run dev
```

The server will run on `http://localhost:3000`. The SQLite database file and
tables are created automatically on first run, along with a seeded test user.

## API Documentation

Base URL: `http://localhost:3000`

All responses are JSON and follow a consistent shape:

```json
{ "success": true|false, "message": "...", "data": { ... } }
```

---

### Health Check

`GET /`

**Response — 200 OK**

```json
{ "success": true, "message": "Task Manager API is running." }
```

---

### Get All Tasks

`GET /tasks`

No request body required.

**Response — 200 OK**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2026-07-26T10:00:00.000Z"
    }
  ]
}
```

---

### Create a Task

`POST /tasks`

**Headers**

```
Content-Type: application/json
```

**Request Body**
| Field | Type | Required | Notes |
|---------------|---------|----------|---------------------------------|
| `title` | string | Yes | Must be a non-empty string |
| `description` | string | No | Defaults to an empty string |

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response — 201 Created**

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "createdAt": "2026-07-26T10:00:00.000Z"
  }
}
```

**Response — 400 Bad Request** (e.g. missing title)

```json
{
  "success": false,
  "message": "Title is required and must be a non-empty string."
}
```

---

### Login

`POST /login`

**Seeded credentials for testing:**
| Username | Password |
|----------|------------|
| `admin` | `admin123` |

**Headers**

```
Content-Type: application/json
```

**Request Body**
| Field | Type | Required |
|------------|--------|----------|
| `username` | string | Yes |
| `password` | string | Yes |

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

The token is a JWT signed with `JWT_SECRET`, valid for **1 hour**. It confirms
successful authentication; this project doesn't currently have a protected
route that requires it.

**Response — 400 Bad Request** (missing username or password)

```json
{
  "success": false,
  "message": "Username is required."
}
```

**Response — 401 Unauthorized** (wrong credentials)

```json
{
  "success": false,
  "message": "Invalid username or password."
}
```

---

### Error Responses

**404 Not Found** — any route that doesn't exist

```json
{
  "success": false,
  "message": "Route /unknown-path not found."
}
```

**500 Internal Server Error** — unexpected server errors

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Notes

- Data is stored in **SQLite** (`src/data/db.sqlite`), so it persists
  across server restarts. The database file and tables are created
  automatically the first time the app runs — no manual setup needed.
- The `.sqlite` file is gitignored on purpose — a fresh clone generates its
  own local database (with the seeded admin user) the first time it runs.
- Passwords are hashed with bcrypt — never stored in plain text.
- Basic input validation is handled via middleware before requests reach
  the controllers.

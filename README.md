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
<img width="1913" height="885" alt="Screenshot 2026-07-26 225111" src="https://github.com/user-attachments/assets/c9475666-225b-4891-91a8-4292ddb0d8b7" />  

- `GET /tasks`
<img width="1601" height="525" alt="Screenshot 2026-07-26 231416" src="https://github.com/user-attachments/assets/7a44158d-1101-4d39-aab6-2884164201e2" />

- `POST /tasks` (success case)
<img width="1611" height="530" alt="Screenshot 2026-07-26 231521" src="https://github.com/user-attachments/assets/c7af8898-462e-43e2-9b28-293eb4b0384c" />

- `POST /tasks` (validation error — missing title)
<img width="1618" height="626" alt="Screenshot 2026-07-27 000706" src="https://github.com/user-attachments/assets/2a3b1107-37a3-4695-aade-11e04e906522" />

- `POST /login` (success case)
<img width="1620" height="576" alt="Screenshot 2026-07-26 231847" src="https://github.com/user-attachments/assets/d4ed2bcd-887f-4287-95f6-2a5e4dc6c5be" />

- `POST /login` (invalid credentials)
<img width="1617" height="571" alt="Screenshot 2026-07-26 231745" src="https://github.com/user-attachments/assets/283c7a9a-5f2d-491d-b53c-934acb1a3bf0" />

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

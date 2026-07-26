# API Documentation — DevFlow AI Sample API

Base URL: `http://localhost:3000` (development) | `https://your-app.onrender.com` (production)

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### Health Check

#### `GET /health`

Returns service health status. Used by CI/CD for deployment verification.

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "service": "devflow-sample-api",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "memory": {
    "used": "45MB",
    "total": "90MB"
  }
}
```

---

### Authentication

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email` — Valid email format
- `password` — Min 8 chars, must contain uppercase, lowercase, and number
- `name` — 2–100 characters

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Errors:**
- `400` — Validation failed
- `409` — Email already registered

---

#### `POST /api/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Errors:**
- `401` — Invalid email or password

---

#### `POST /api/auth/refresh`

Refresh an expired access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbG..."
  }
}
```

---

### Tasks

All task endpoints require authentication.

#### `GET /api/tasks`

List tasks for the authenticated user with pagination and filtering.

**Query Parameters:**
| Parameter | Type | Default | Options |
|---|---|---|---|
| `page` | number | 1 | Positive integer |
| `limit` | number | 20 | 1–100 |
| `status` | string | — | `TODO`, `IN_PROGRESS`, `DONE`, `ARCHIVED` |
| `priority` | string | — | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `sortBy` | string | `createdAt` | `createdAt`, `updatedAt`, `dueDate`, `priority`, `title` |
| `order` | string | `desc` | `asc`, `desc` |
| `search` | string | — | Full-text search on title/description |

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Complete project",
        "description": "Finish the DevFlow AI project",
        "status": "TODO",
        "priority": "HIGH",
        "dueDate": "2025-12-31T00:00:00.000Z",
        "userId": "uuid",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

---

#### `GET /api/tasks/:id`

Get a single task by ID. Only the task owner can access it.

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "task": { ... }
  }
}
```

**Errors:**
- `404` — Task not found
- `403` — Not the task owner

---

#### `POST /api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Optional description",
  "priority": "HIGH",
  "dueDate": "2025-12-31"
}
```

**Validation Rules:**
- `title` — Required, 1–255 characters
- `description` — Optional, max 2000 characters
- `priority` — Optional, one of: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `dueDate` — Optional, valid date

**Response:** `201 Created`

---

#### `PATCH /api/tasks/:id`

Update an existing task. Only the task owner can update it.

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "status": "DONE",
  "priority": "LOW"
}
```

**Response:** `200 OK`

---

#### `DELETE /api/tasks/:id`

Delete a task. Only the task owner can delete it.

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Task deleted successfully"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint Group | Window | Max Requests |
|---|---|---|
| Global | 15 minutes | 100 |
| Auth (`/api/auth/*`) | 15 minutes | 20 |

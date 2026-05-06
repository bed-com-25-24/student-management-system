# Student Management System — API Documentation

Base URL: `http://localhost:3000`

---

## Authentication

Most endpoints require a valid **JWT Bearer token**.

To obtain a token, log in via `POST /auth/login`. Then pass the token in all subsequent protected requests:

```
Authorization: Bearer <your_access_token>
```

### Roles
| Role    | Access Level                                     |
|---------|--------------------------------------------------|
| `user`  | Can access their own profile and grade data      |
| `admin` | Full access to all routes, including user management |

---

## 🔓 Public Endpoints (No Auth Required)

### `POST /auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

**Response:**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

---

### `POST /auth/logout`
Stateless logout — client should discard the JWT.

**Response:**
```json
{ "message": "Logged out successfully" }
```

---

### `PUT /auth/reset`
Request a password reset OTP. A styled HTML email with a 6-digit OTP will be sent to the address if it exists.

**Body:**
```json
{ "email": "user@example.com" }
```

**Response:**
```json
{ "message": "If email exists, an OTP will be sent" }
```

> The OTP is valid for **15 minutes**. Email is sent via Nodemailer (configure `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` in `.env`).

---

### `POST /auth/verify`
Verify a password reset OTP.

**Body:**
```json
{ "email": "user@example.com", "otp": "123456" }
```

**Response:**
```json
{ "message": "OTP verified successfully" }
```

---

### `PUT /auth/password`
Reset the password using a verified OTP.

**Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePass",
  "confirmPassword": "newSecurePass"
}
```

**Response:**
```json
{ "message": "Password has been reset successfully" }
```

---

### `POST /users`
Register a new user.

**Body:**
```json
{
  "firstName": "John",
  "LastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword",
  "role": "user"
}
```

---

## 🔒 Protected Endpoints (JWT Required)

### Auth

#### `GET /auth/me`
Get the profile of the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "firstName": "John",
  "LastName": "Doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

### Users

#### `GET /users` 🔒 `admin` only
List all users.

**Headers:** `Authorization: Bearer <token>`

---

#### `GET /users/:id` 🔒 Any authenticated user
Get a single user by ID.

**Headers:** `Authorization: Bearer <token>`

---

#### `PATCH /users/:id` 🔒 Any authenticated user
Update a user by ID.

**Headers:** `Authorization: Bearer <token>`

**Body:** (any subset of user fields)
```json
{ "firstName": "Jane" }
```

---

#### `DELETE /users/:id` 🔒 `admin` only
Delete a user by ID.

**Headers:** `Authorization: Bearer <token>`

---

### Grades

> All grade endpoints require a valid JWT. Currently accessible to any authenticated user; role-specific restrictions can be applied per route via `@Roles(...)`.

#### `POST /grades` 🔒
Create a new grade entry.

**Body:**
```json
{
  "studentId": 1,
  "subjectId": 2,
  "classId": 3,
  "score": 85,
  "term": "Term 1"
}
```

---

#### `GET /grades` 🔒
List all grades. Optionally filter by class and term.

**Query params:** `?class=3&term=Term+1`

---

#### `GET /grades/:id` 🔒
Get a specific grade entry by ID.

---

#### `PATCH /grades/:id` 🔒
Update a grade entry by ID.

---

#### `GET /grades/averages` 🔒
Get subject averages for a class in a given term.

**Query params:** `?class=3&term=Term+1`

---

#### `GET /grades/ranking` 🔒
Get class ranking for a given term.

**Query params:** `?class=3&term=Term+1`

---

#### `GET /grades/final/:studentId/:term` 🔒
Get the final computed grade for a student in a term.

---

#### `GET /grades/student/:studentId/subject/:subjectId` 🔒
Get a student's grade in a specific subject.

**Query params:** `?term=Term+1` (optional)

---

#### `POST /grades/student/:studentId/subject/:subjectId` 🔒
Create a grade for a specific student and subject.

**Query params:** `?term=Term+1` (required)

**Body:**
```json
{ "classId": 3, "score": 78 }
```

---

#### `PATCH /grades/student/:studentId/subject/:subjectId` 🔒
Update a student's grade in a specific subject.

**Query params:** `?term=Term+1` (optional)

---

### Reports

> All report endpoints require a valid JWT.

#### `POST /api/v1/reports/generate` 🔒
Generate reports for a batch of students.

**Body:** *(see `GenerateBatchReportDto`)*

---

#### `GET /api/v1/reports/student/:id` 🔒
Get a student's report card.

**Query params:** `?term=Term+1`

---

#### `GET /api/v1/reports/class/:class` 🔒
Get all report cards for a class.

**Query params:** `?term=Term+1`

---

#### `GET /api/v1/reports/class/:class/overview` 🔒
Get a performance overview for a class.

**Query params:** `?term=Term+1`

---

## Environment Variables

| Variable         | Description                             | Default                     |
|------------------|-----------------------------------------|-----------------------------|
| `JWT_SECRET`     | Secret key used to sign JWT tokens      | *(required)*                |
| `MAIL_HOST`      | SMTP host                               | `sandbox.smtp.mailtrap.io`  |
| `MAIL_PORT`      | SMTP port                               | `2525`                      |
| `MAIL_USER`      | SMTP username                           | *(from your provider)*      |
| `MAIL_PASS`      | SMTP password                           | *(from your provider)*      |
| `DB_HOST`        | Oracle DB host                          | `localhost`                 |
| `DB_PORT`        | Oracle DB port                          | `1521`                      |
| `DB_USERNAME`    | Oracle DB username                      | *(required)*                |
| `DB_PASSWORD`    | Oracle DB password                      | *(required)*                |
| `DB_SERVICE_NAME`| Oracle DB service name                  | *(required)*                |
| `DB_SYNCHRONIZE` | Auto-sync schema (disable in prod)      | `true`                      |
| `PORT`           | HTTP server port                        | `3000`                      |

# Customer Inquiry Management System

Customer Inquiry Management System is a full-stack assessment project for
recording, searching, and tracking customer inquiries.

## Technology

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Java 17, Spring Boot, JDBC
- **Database:** PostgreSQL
- **Validation:** Zod

## Current functionality

- Inquiry dashboard with summary counts
- Search by customer, contact, subject, or inquiry ID
- Filter inquiries by `New`, `In Progress`, or `Resolved`
- Create an inquiry with required customer, contact, subject, and description
- Update an inquiry status
- Staff self-registration and sign-in with hashed passwords and expiring sessions
- PostgreSQL schema and Spring Boot API for inquiry reads, creates, and status updates
- PostgreSQL-backed health check at `GET /api/health`

> **Implementation status:** The current dashboard still uses in-memory sample
> data and does not yet call the inquiry API. Account registration and sign-in
> are connected to the backend; the dashboard requires an authenticated staff
> session.

## Project structure

```text
backend/
  database/schema.sql    PostgreSQL schema
  pom.xml                Maven build configuration
  src/main/java/         Spring Boot API
frontend/
  app/page.tsx           Sign-in screen placeholder
  app/dashboard/         Inquiry dashboard
  app/splash/            Splash screen
```

## Prerequisites

- Java 17 or later
- Maven 3.9 or later
- PostgreSQL 14 or later

## Database setup

Create a PostgreSQL database named `inquiro_tracker`. The backend applies
`backend/database/schema.sql` automatically at startup.

The backend reads these environment variables:

```text
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_DB_NAME
DB_USER=your_DB_USER
DB_PASSWORD=your-postgres-password
```

Spring Boot does not load a `.env` file by itself. In PowerShell, set the
variables in the same terminal before starting the backend:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "inquiro_tracker"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = Read-Host "PostgreSQL password"
$env:AUTH_COOKIE_SECURE = "false"
$env:REQUIRE_HTTPS = "false"
$env:STAFF_SIGNUP_INVITE_CODE = Read-Host "Staff invitation code"
Set-Location backend
mvn spring-boot:run
```

Choose a strong invitation code and provide it only to staff who may register.
The backend rejects signup if no code is configured or if the submitted code
does not match. Existing accounts are unapproved after the schema update; an
administrator can approve a known account directly in PostgreSQL:

```sql
UPDATE staff_users SET approved = TRUE
WHERE LOWER(email) = LOWER('staff@example.com');
```

For local HTTP development, set both `AUTH_COOKIE_SECURE` and `REQUIRE_HTTPS`
to `false`. Keep both `true` when the backend is served over HTTPS. Behind a
TLS-terminating proxy, set `TRUSTED_PROXY_ADDRESSES` to the proxy's exact IP
address(es), and configure the proxy to overwrite `X-Forwarded-Proto`.

## Run locally

Install frontend dependencies:
```bash
cd frontend
npm install
```

In another terminal, start the frontend:

```powershell
Set-Location frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The API runs at [http://localhost:4000](http://localhost:4000).

## Run with Docker

For local HTTP development, create a root `.env` file with `DB_NAME`,
`DB_USER`, `DB_PASSWORD`, `STAFF_SIGNUP_INVITE_CODE`,
`AUTH_COOKIE_SECURE=false`, and `REQUIRE_HTTPS=false`, then start the services.
Use a strong private invitation code, and set `AUTH_COOKIE_SECURE=true` and
`REQUIRE_HTTPS=true` when serving over HTTPS.

```bash
docker compose up --build
```

`.env` is ignored by Git and must not be committed. PostgreSQL is available
only to the Docker services; the backend is exposed at port `4000` and the
frontend at port `3000`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check API and database connectivity |
| `POST` | `/api/auth/signup` | Create a staff account and sign in |
| `POST` | `/api/auth/login` | Sign in to an existing staff account |
| `GET` | `/api/auth/me` | Check the current staff session |
| `POST` | `/api/auth/logout` | End the current staff session |
| `GET` | `/api/inquiries` | List inquiries |
| `POST` | `/api/inquiries` | Create an inquiry |
| `PATCH` | `/api/inquiries/:id/status` | Update an inquiry status |

Signup accepts JSON containing `email`, `password`, and `inviteCode`; login
accepts `email` and `password`. Passwords must be at least 8 characters; the
API stores BCrypt hashes and issues an HTTP-only, 8-hour session cookie. Signup is disabled until
`STAFF_SIGNUP_INVITE_CODE` is set. Session cookies are `Secure` by default and
the API rejects non-HTTPS requests by default. Set `AUTH_COOKIE_SECURE=false`
and `REQUIRE_HTTPS=false` only for local HTTP development. The frontend
defaults to `http://localhost:4000/api`; set `NEXT_PUBLIC_API_URL` if the API
is hosted elsewhere.

### Create inquiry example

```json
{
  "customer": "Amara Perera",
  "contact": "amara@example.com",
  "subject": "Payment issue",
  "description": "A payment was deducted but is not reflected in the account."
}
```

Valid statuses are:

```text
New
In Progress
Resolved
```

The API validates required fields, length limits, inquiry IDs, and statuses.

## Assessment checklist

The remaining work required for the complete assessment submission is:

- Add seeded staff authentication and enforce it in the backend
- Connect the frontend dashboard to the Express API
- Define and enforce inquiry ownership/access rules
- Define status transition behavior, including stale data handling
- Add loading, API failure, authentication failure, and record-not-found states
- Decide and document a duplicate inquiry policy
- Add one backend test and one frontend test
- Add `DECISIONS.md` with assumptions, trade-offs, and AI usage
- Record the required 3–5 minute demonstration

## Testing

Automated assessment tests have not yet been added. Once implemented, the
backend and frontend test commands will be documented here.

# Customer Inquiry Management System

Customer Inquiry Management System is a full-stack assessment project for
recording, searching, and tracking customer inquiries.

## Technology

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Validation:** Zod

## Current functionality

- Inquiry dashboard with summary counts
- Search by customer, contact, subject, or inquiry ID
- Filter inquiries by `New`, `In Progress`, or `Resolved`
- Create an inquiry with required customer, contact, subject, and description
- Update an inquiry status
- PostgreSQL schema and Express API for inquiry reads, creates, and status updates
- PostgreSQL-backed health check at `GET /api/health`

> **Implementation status:** The current dashboard still uses in-memory sample
> data and does not yet call the backend API. Authentication, backend-enforced
> access control, automated tests, and the final assessment documentation are
> still to be completed.

## Project structure

```text
backend/
  database/schema.sql    PostgreSQL schema
  src/db.ts              PostgreSQL connection pool
  src/server.ts          Express API
frontend/
  app/page.tsx           Sign-in screen placeholder
  app/dashboard/         Inquiry dashboard
  app/splash/            Splash screen
```

## Prerequisites

- Node.js 20 or later
- PostgreSQL 14 or later

## Database setup

Create a PostgreSQL database named `inquiro_tracker`, then run:

```bash
psql -U postgres -d inquiro_tracker -f backend/database/schema.sql
```

The backend uses these environment variables. Defaults are shown where
available:

```text
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_DB_NAME
DB_USER=your_DB_USER
DB_PASSWORD=your-postgres-password
```

Place them in `backend/.env`.

## Run locally

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The API runs at [http://localhost:4000](http://localhost:4000).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check API and database connectivity |
| `GET` | `/api/inquiries` | List inquiries |
| `POST` | `/api/inquiries` | Create an inquiry |
| `PATCH` | `/api/inquiries/:id/status` | Update an inquiry status |

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

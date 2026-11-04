# Customer Inquiry Management System

Customer Inquiry Management System is a full-stack assessment project for
recording, searching, and tracking customer inquiries.

## Technology

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Java 17, Spring Boot
- **Database:** PostgreSQL
- **Validation:** Jakarta Bean Validation

## Current functionality

- Inquiry dashboard with summary counts
- Search by customer, contact, subject, or inquiry ID
- Filter inquiries by `New`, `In Progress`, or `Resolved`
- Create an inquiry with required customer, contact, subject, and description
- Update an inquiry status
- PostgreSQL schema and Spring Boot REST API for inquiry reads, creates, searches, and status updates
- PostgreSQL-backed health check at `GET /api/health`

> **Implementation status:** Authentication, backend-enforced access control,
> automated tests, and the final assessment documentation are still to be
> completed.

## Project structure

```text
backend/
  database/schema.sql    PostgreSQL schema
  pom.xml                Maven and Spring Boot configuration
  src/main/java/         Spring Boot REST API, services, and PostgreSQL access
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

Create a PostgreSQL database named `inquiro_tracker`, then run:

```bash
psql -U postgres -d inquiro_tracker -f backend/database/schema.sql
```

The Spring Boot backend uses these environment variables. Defaults are shown
where available:

```text
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inquiro_tracker
DB_USER=postgres
DB_PASSWORD=your-postgres-password
```

Set them in the shell environment before starting the backend, or configure
them in your IDE run configuration.

## Run locally

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend in one terminal:

```bash
cd backend
mvn spring-boot:run
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
- Add automated tests for the Spring Boot API and frontend
- Define and enforce inquiry ownership/access rules
- Define status transition behavior, including stale data handling
- Add loading, API failure, authentication failure, and record-not-found states
- Decide and document a duplicate inquiry policy
- Add one backend test and one frontend test
- Add `DECISIONS.md` with assumptions, trade-offs, and AI usage
- Record the required 3–5 minute demonstration

## Testing

Run the backend tests with:

```bash
cd backend
mvn test
```

Run the frontend lint check with:

```bash
cd frontend
npm run lint
```

# Art Gallery & Event Management System

A full-stack art gallery and event management application built as part of a Full Stack Developer technical assessment.

The application provides an administrative interface for managing artists and artworks, alongside an event performance dashboard displaying ticket sales, event views, sales conversion, and revenue metrics.

The project consists of a **Next.js + TypeScript frontend** and a **Go REST API**, backed by **SQLite**.

---

## Features

### Dashboard

The dashboard provides an overview of the currently active event, including:

- Total event views
- Tickets sold
- Ticket page views
- Sales conversion
- Total ticket revenue
- Daily ticket sales visualization
- Recently added artworks

Dashboard values are calculated from backend event metric data rather than being hardcoded in the frontend.

### Artists

Artist management includes:

- View artists
- Search artists
- Add an artist
- Edit artist details
- Delete an artist
- Artist profile information
- Biography and bibliography
- Nationality and artist information
- Website, CV/document, and social links

### Artworks

Artwork management includes:

- View artwork collection
- Search and filter artworks
- Add artworks
- Edit artworks
- Delete artworks
- Assign artworks to artists
- Artwork detail view
- Pricing information
- Dimensions and medium
- Edition information
- Packaging information
- Exhibition label preview and configuration

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Next.js App Router

### Backend

- Go
- Chi Router
- `database/sql`
- SQLite
- REST API

### Testing

- Go `testing`
- `httptest`
- In-memory SQLite test databases
- ESLint
- TypeScript production build validation

---

## Project Structure

```text
ArtGallery/
├── backend/
│   ├── cmd/
│   │   └── art-gallery/
│   │       └── main.go
│   ├── internal/
│   │   ├── artist/
│   │   ├── artwork/
│   │   ├── dashboard/
│   │   ├── database/
│   │   ├── event/
│   │   ├── middleware/
│   │   └── testutil/
│   ├── data/
│   ├── go.mod
│   └── go.sum
├── frontend/
│   ├── app/
│   │   ├── artists/
│   │   ├── artworks/
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── artists/
│   │   ├── artworks/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   ├── public/
│   ├── types/
│   └── package.json
└── README.md
```

---

## Architecture

The application uses a separated frontend and backend architecture.

```text
Browser
   │
   ▼
Next.js + TypeScript
   │
   │ REST / JSON
   ▼
Go HTTP API
   │
   ▼
Service Layer
   │
   ▼
Repository Layer
   │
   ▼
SQLite
```

### Frontend Architecture

Next.js is responsible for rendering the user interface and consuming the Go API.

Server Components are used for initial page data where appropriate, while Client Components manage interactive UI state such as search, filters, drawer visibility, selected records, form state, saving and deleting state, and client-side error state.

A global state management library was intentionally not introduced because the current application state is predominantly page-specific. Keeping transient state close to the components that use it reduces unnecessary complexity.

API communication is centralized through the frontend API layer rather than being implemented independently inside individual components.

### Backend Architecture

The Go backend follows a layered structure:

```text
HTTP Handler
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Database
```

**Handlers** are responsible for HTTP concerns such as request parsing, responses, and status codes.

**Services** contain business rules and validation.

**Repositories** handle persistence and database queries.

This separation keeps HTTP logic, business logic, and persistence concerns independent and makes the application easier to test and maintain.

---

## Database

SQLite was selected for the assessment because it provides a real relational database while keeping local setup lightweight and portable.

The database contains the following core tables:

- `artists`
- `artworks`
- `events`
- `event_daily_metrics`

### Relationships

An artist can have multiple artworks.

```text
Artist 1 ──────── * Artwork
```

An artwork may optionally reference an artist. If an artist is deleted, the artwork remains and its artist reference is set to `NULL`.

An event can contain multiple daily performance records.

```text
Event 1 ──────── * Event Daily Metrics
```

---

## Getting Started

### Prerequisites

Ensure the following are installed:

- Go
- Node.js
- Yarn

### Running the Backend

From the project root:

```bash
cd backend
go run ./cmd/art-gallery
```

The API runs at:

```text
http://localhost:8080
```

The application initializes the SQLite schema and demo data required for local development.

### Running the Frontend

Open another terminal:

```bash
cd frontend
yarn install
yarn dev
```

The frontend runs at:

```text
http://localhost:3000
```

By default, the frontend connects to:

```text
http://localhost:8080
```

A different backend URL can be configured using:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## API Endpoints

### Artists

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/artists` | Get all artists |
| `GET` | `/api/artists/{id}` | Get an artist |
| `POST` | `/api/artists` | Create an artist |
| `PUT` | `/api/artists/{id}` | Update an artist |
| `DELETE` | `/api/artists/{id}` | Delete an artist |

### Artworks

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/artworks` | Get all artworks |
| `GET` | `/api/artworks/{id}` | Get an artwork |
| `POST` | `/api/artworks` | Create an artwork |
| `PUT` | `/api/artworks/{id}` | Update an artwork |
| `DELETE` | `/api/artworks/{id}` | Delete an artwork |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Get current event performance data |

---

## Dashboard Metrics

Dashboard metrics are derived from event performance records stored by date.

The dashboard aggregates event views, ticket page views, tickets sold, and revenue.

Sales conversion is calculated as:

```text
tickets sold / ticket page views × 100
```

The calculation is performed by the backend rather than the frontend so that business logic remains centralized.

---

## Error Handling

Error handling is implemented at both the frontend and backend layers.

### Frontend

The frontend handles failed API requests, failed create/update/delete operations, loading failures during server-rendered routes, empty states, and user-facing retry states.

Next.js route-level error boundaries provide contextual error pages when initial page data cannot be loaded.

Interactive client components maintain their own error state for failures that occur after the page has loaded, such as unsuccessful create, update, or delete requests.

This separates:

- **Empty state** — the request succeeded but no records exist
- **Error state** — the request failed
- **Success state** — data was successfully retrieved

### Backend

The API validates incoming data and returns appropriate HTTP status codes and JSON responses when requests cannot be completed.

Validation is performed in the backend even when equivalent validation exists in the UI so that invalid data cannot bypass business rules by calling the API directly.

---

## Middleware

The backend includes middleware for request logging and CORS.

Request logging captures the HTTP method, request path, and request duration.

CORS is configured to allow the local Next.js frontend to communicate with the Go API during development. Supported methods include `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS`.

---

## Testing

### Backend Tests

Run:

```bash
cd backend
go test ./...
```

To force a fresh test run without using Go's test cache:

```bash
go test ./... -count=1
```

The backend includes tests for artist, artwork, and dashboard behavior.

Tests use isolated in-memory SQLite databases so that they do not modify development data. The test database is configured with a single open connection because SQLite in-memory databases are connection-specific.

Tests cover examples such as:

- Required artist data validation
- Successful artist creation
- Artwork validation
- Invalid artist assignment
- Negative artwork pricing
- Dashboard metric aggregation
- Dashboard HTTP response behavior

### Go Static Analysis

```bash
go vet ./...
```

### Frontend Linting

```bash
cd frontend
yarn lint
```

### Frontend Production Build

```bash
yarn build
```

This validates the production compilation and TypeScript build.

---

## Demo Data

The application includes seeded demo data so that the system can be reviewed immediately after setup.

Demo data includes artists, artworks, an active exhibition/event, and daily event performance metrics.

---

## Design Approach

The user interface is based on the provided Figma designs and Art Circles visual language.

The implementation focuses on clear information hierarchy, generous spacing, minimal visual noise, reusable interface components, responsive layouts, drawer-based create/edit workflows, and contextual empty and error states.

Where the supplied designs did not define a complete dashboard experience, the existing product visual language was used to create a consistent event-performance dashboard while keeping the required assessment functionality.

---

## Assumptions

- The application represents a single gallery/admin context.
- Authentication and multi-user permissions are outside the current scope.
- A single application currency is used.
- Event performance data is represented through daily metrics.
- An artwork can exist without an assigned artist.
- Exhibition label configuration is a frontend interaction for the current assessment and is not persisted as a separate backend entity.
- Image URLs are represented in the data model, while demo artwork images may use placeholders where image assets are unavailable.

---

## Tradeoffs

### SQLite

SQLite was chosen instead of PostgreSQL to make the assessment easy to clone and run without requiring external infrastructure.

For a larger production deployment, PostgreSQL would be a natural migration path.

### Local Component State

React component state was used instead of Redux, Zustand, or another global state library.

The current interactions are primarily local to individual pages, so a global state layer would introduce additional complexity without a clear benefit.

### REST

REST was selected over GraphQL because the domain and required operations are straightforward CRUD and dashboard queries. REST keeps the API easy to inspect, test, and consume for the current scope.

### Image Handling

The data model supports image URLs, but a production asset-storage pipeline was intentionally kept outside the scope of the assessment. A production system could integrate object storage and image processing.

### Exhibition Labels

Exhibition label configuration is implemented as frontend state rather than introducing additional persistence and domain entities whose lifecycle was not defined by the supplied requirements.

---

## Scope Decisions

The implementation focuses on:

- Dashboard and event performance
- Artist management
- Artwork management
- Ticket performance metrics
- Exhibition label interaction

Features such as authentication, CRM, banking, marketing, and full event administration were intentionally not implemented because they fall outside the core assessment scope.

Artist duplication was also omitted because the expected domain behavior for duplicated artist records was not sufficiently defined.

---

## Future Improvements

With additional development time, possible extensions include:

- Authentication and role-based authorization
- PostgreSQL deployment
- Artwork image uploads and object storage
- Persisted exhibition label settings
- Event management
- Ticket and RSVP management
- Pagination for larger collections
- More comprehensive integration and end-to-end testing
- Accessibility auditing
- Production observability and monitoring

---

## Author

**Joan Runyiri**

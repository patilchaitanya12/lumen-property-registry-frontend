cat > README.md <<'EOF'
# Lumen Property Registry - Frontend

A production-oriented React frontend for the Lumen Property Registry.

The application provides a unified interface for exploring property units, owners, locations, orders, and ownership history. It is connected to the Lumen Property Registry FastAPI backend and is designed as a manager-facing registry and data exploration interface.

## Overview

The frontend implements the UI prototype required for the Lumen Property Registry task.

It provides:

- Dashboard with registry statistics
- Global search
- Owner registry and owner profiles
- Unit registry and unit profiles
- Location registry and location profiles
- Ownership history
- Order registry and order profiles
- Navigation between related entities
- Responsive layouts for desktop and mobile
- Dark and light visual presentation
- Loading and empty states
- Backend API integration

The application treats Unit and Owner records as permanent identities and exposes their relationships through the UI.

## Live Application

Frontend:

https://lumen-property-registry-frontend.vercel.app/

Backend API:

https://lumen-property-registry-backend.onrender.com/

Backend API documentation:

https://lumen-property-registry-backend.onrender.com/docs

## Related Repository

Backend repository:

https://github.com/patilchaitanya12/lumen-property-registry-backend

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React
- Fetch API
- Vercel

## Application Architecture

The frontend follows a simple API-driven architecture.

Browser
    |
    v
React Application
    |
    +-- React Router
    |
    +-- Page Components
    |
    +-- Reusable UI Components
    |
    +-- API Client
    |
    v
FastAPI Backend
    |
    v
Supabase PostgreSQL

The frontend does not directly access the PostgreSQL database.

All registry data is retrieved through the backend REST API.

## Main Routes

### Dashboard

Route:

/

Provides a high-level overview of the registry.

Displayed metrics include:

- Owners
- Units
- Locations
- Orders
- Ownership relationships
- Multi-owner units

The dashboard also provides entry points into the major registry sections.

### Global Search

Route:

/search

Searches across registry entities and provides navigation to relevant records.

Supported search concepts include:

- Unit ID
- Unit code
- Owner ID
- Owner name
- Order ID

### Owners

Route:

/owners

Provides a paginated owner registry.

Each owner record includes:

- Owner ID
- Name
- Owner type
- Country

Owner records can be opened to view the complete owner profile.

### Owner Profile

Route:

/owners/:ownerId

Provides detailed information about a single owner.

The profile includes:

- Owner ID
- Record ID
- Name
- Normalized name
- Owner type
- Country
- Identity numbers where available
- Contact information
- Property count
- Registered units
- Ownership history

The owner profile also provides navigation to related units.

### Units

Route:

/properties

Provides the property unit registry.

Each unit includes:

- Unit ID
- Property ID
- Unit code
- Unit number
- Location ID
- Property type
- Size where available

The registry is paginated to support the large dataset.

### Unit Profile

Route:

/properties/:unitId

Provides detailed information about a single physical unit.

The profile includes:

- Unit ID
- Property ID
- Unit code
- Unit number
- Property type
- Size
- DM identifiers where available
- Land sub-number where available
- Location
- Current and historical owner relationships
- Ownership history

Ownership history is displayed separately so that historical relationships remain visible instead of being overwritten.

### Locations

Route:

/locations

Provides the location registry.

Location records can include:

- Location ID
- Area
- Community
- Project
- Project land
- Building number
- Building name
- Number of registered units

### Location Profile

Route:

/locations/:locationId

Provides detailed information about a location and its registered units.

The profile includes:

- Location identifiers
- Area
- Community
- Project
- Building information
- Unit count
- Units associated with the location

Units can be opened directly from the location profile.

### Orders

Route:

/orders

Provides the order or transaction registry interface.

The current database contains zero imported orders because the supplied transaction summary did not contain row-level order identity.

The UI and API structure are prepared for transaction-level order data when an appropriate source becomes available.

### History

Route:

/history

Provides an interface for reviewing historical ownership relationships and registry changes.

The history model is designed around preserving relationships instead of replacing previous records.

## Entity Relationships

The frontend represents the following primary relationships:

Owner
    |
    v
Unit
    |
    v
Location

Ownership history connects Owners and Units across time.

Order relationships are designed as:

Order
    |
    +-- Unit
    |
    +-- Owner or other participating Client

The application provides navigation between related entities wherever the API provides the relationship.

## Identity Model

The registry uses stable identifiers instead of relying only on display names.

Primary identifiers include:

- owner_id
- unit_id
- property_id
- location_id
- order_id

Names are treated as descriptive attributes and are not assumed to be unique identifiers.

This is particularly important for owner records because different people or organizations can have similar or identical names.

## Unit Identification

The frontend exposes the permanent unit identity created by the registry backend.

The backend maps the source property identifier to:

unit_id = property_id

The unit code is displayed as an additional registry attribute.

A unit should represent one physical property even when it appears in multiple source records.

## Ownership History

Ownership relationships are represented separately from the Owner and Unit identity records.

This allows the UI to display:

- Owner ID
- Owner name
- Unit ID
- Start date
- End date
- Source order where available

Historical dates are displayed when available from the source data.

Where the current registry does not contain reliable ownership dates, the UI explicitly shows that the period is unavailable rather than inventing dates.

## Current Data Scope

The registry was populated from the supplied Lumen workbook.

Current database counts include approximately:

- 381,996 owners
- 1,377,629 units
- 48,375 locations
- 1,378,572 ownership relationships
- 0 orders

The exact values are available from the backend dashboard API and may change if additional source data is ingested.

## Orders Data Limitation

The supplied workbook contains a TRANSACTIONS_SUMMARY sheet, but this is an aggregate summary rather than a row-level transaction source.

Because an order requires a unique transaction identity, the frontend does not fabricate orders from transaction dates or summary values.

The Orders section is therefore implemented as a ready interface while the current order dataset remains empty.

A row-level transaction source containing a stable transaction or order identifier is required to populate this section correctly.

## API Integration

The frontend communicates with the backend using REST APIs.

The API base URL is configured using:

VITE_API_URL

For local development, the application falls back to:

http://127.0.0.1:8000

Example API requests:

GET /health

GET /api/dashboard

GET /api/owners

GET /api/owners/{owner_id}

GET /api/owners/{owner_id}/units

GET /api/owners/{owner_id}/history

GET /api/units

GET /api/units/{unit_id}

GET /api/units/{unit_id}/owners

GET /api/units/{unit_id}/history

GET /api/locations

GET /api/locations/{location_id}

GET /api/orders

GET /api/orders/{order_id}

GET /api/history

GET /api/search

The backend API documentation is available at:

https://lumen-property-registry-backend.onrender.com/docs

## Project Structure

src/
    components/
    lib/
        api.ts
    pages/
        Dashboard.tsx
        Search.tsx
        Owners.tsx
        OwnerProfile.tsx
        Units.tsx
        UnitProfile.tsx
        Locations.tsx
        LocationProfile.tsx
        Orders.tsx
        History.tsx
    App.tsx
    main.tsx
    index.css

public/

package.json
vite.config.ts
tsconfig.json
README.md

The exact structure may evolve as reusable components are extracted.

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- Git

### Clone

git clone git@github-personal:patilchaitanya12/lumen-property-registry-frontend.git

cd lumen-property-registry-frontend

### Install Dependencies

npm install

### Configure Backend URL

Create:

.env.local

Add:

VITE_API_URL=http://127.0.0.1:8000

For the deployed application, VITE_API_URL points to the deployed FastAPI backend.

### Start Development Server

npm run dev

Vite will start the development server and display the local URL.

### Build

npm run build

The production build should complete without TypeScript or Vite build errors.

## Deployment

The frontend is deployed using Vercel.

Deployment flow:

GitHub
    |
    v
Vercel
    |
    v
React Production Build

The application uses the VITE_API_URL environment variable to connect to the deployed backend.

## Responsive Design

The application was designed for both desktop and smaller screens.

Responsive work includes:

- Collapsible navigation behavior
- Responsive sidebar
- Mobile-friendly tables and cards
- Responsive search
- Responsive profile pages
- Responsive history views
- Responsive location pages
- Responsive order pages
- Responsive dashboard layout

The goal is to keep the registry usable without requiring desktop-only screen dimensions.

## UI Design Principles

The interface follows a minimal manager-facing design approach.

Key principles:

- Clear information hierarchy
- Low visual noise
- Strong entity identification
- Consistent spacing
- Clear navigation
- Responsive layouts
- Meaningful empty states
- Direct access to related records
- Human-readable labels
- Stable identifiers shown prominently

The design is intentionally closer to a modern SaaS administration interface than a raw database viewer.

## Data Navigation

The application is designed around entity navigation.

Typical flows include:

Owner
    |
    +-- View owner profile
            |
            +-- View registered units
                    |
                    +-- View unit profile
                            |
                            +-- View location
                            |
                            +-- View ownership history

Location
    |
    +-- View registered units
            |
            +-- View unit profile

Unit
    |
    +-- View owners
    +-- View ownership history
    +-- View location

This makes the relationships in the registry directly visible to a user.

## Validation and Testing

Before deployment, the frontend was verified through:

- Production build
- TypeScript compilation
- API integration testing
- Route testing
- Responsive UI testing
- Unit profile testing
- Owner profile testing
- Location profile testing
- Ownership history testing
- Global search testing

The frontend build must complete successfully before changes are considered ready for deployment.

## Environment Variables

The frontend uses:

VITE_API_URL

Example:

VITE_API_URL=http://127.0.0.1:8000

Environment files containing secrets or local configuration should not be committed to Git.

## Git Workflow

The frontend is maintained in its own Git repository.

Remote:

git@github-personal:patilchaitanya12/lumen-property-registry-frontend.git

Changes are committed using focused commits.

Examples:

feat: connect locations to registered units

feat: add unit ownership history

fix: improve dashboard mobile layout

fix: improve responsive registry pages

This keeps the project history understandable and makes individual changes easy to review.

## Relationship With Backend

The frontend and backend are intentionally maintained as separate repositories.

Frontend:

React + TypeScript + Vite

Backend:

Python + FastAPI

Database:

Supabase PostgreSQL

Communication:

REST API

This separation allows the UI and API to evolve independently while maintaining a clear contract between them.

## Production URLs

Frontend:

https://lumen-property-registry-frontend.vercel.app/

Backend:

https://lumen-property-registry-backend.onrender.com/

Backend health check:

https://lumen-property-registry-backend.onrender.com/health

Backend API documentation:

https://lumen-property-registry-backend.onrender.com/docs

## Project Status

The frontend prototype is implemented and connected to the backend.

Implemented:

- Dashboard
- Owner registry
- Owner profile
- Unit registry
- Unit profile
- Location registry
- Location profile
- Search
- Ownership history
- Order interface
- History interface
- Responsive navigation
- Responsive registry pages
- Backend API integration
- Production deployment

Orders remain empty because a valid row-level transaction source with stable order identity was not included in the supplied dataset.

## Final Notes

The frontend is intended to demonstrate how the Lumen registry data model can be exposed as a usable application rather than only as database tables.

The central design principle is:

Permanent identities first, relationships second, history preserved.

The UI therefore focuses on stable Unit, Owner, Location, and Order identifiers and makes their relationships directly navigable.

For database architecture, ingestion rules, identity resolution, and backend implementation details, refer to the backend repository documentation.
EOF
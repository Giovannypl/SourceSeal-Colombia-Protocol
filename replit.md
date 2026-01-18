# SourceSeal Protocol

## Overview

SourceSeal is a content integrity verification system implementing Colombian Law 1978 compliance for digital content protection. The application provides cryptographic sealing of content using Zero-Knowledge Proofs (ZKP), a tiered enforcement system based on violation reports, and an ethical filtering mechanism. Built as a full-stack TypeScript application with a cyberpunk-themed UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme (dark mode, neon colors, sharp corners)
- **Build Tool**: Vite with hot module replacement

The frontend follows a pages-based structure with reusable components. Custom hooks in `client/src/hooks/` abstract API interactions. The design system uses CSS variables for theming with a brutalist/cyberpunk aesthetic.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas shared between frontend and backend
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with type-safe contracts

The server implements domain-specific logic including:
- ZKP generation using modular exponentiation
- Tiered enforcement evaluation (3 levels based on report counts and financial damage)
- Cryptographic hashing for content seals

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with output to `./migrations`

Core tables:
- `seals`: Content seals with ZKP commitments and metadata
- `reports`: Violation reports linked to seals
- `enforcements`: Enforcement actions with severity levels

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod validation schemas
- `routes.ts`: API contract definitions with request/response types

## External Dependencies

### Database
- PostgreSQL database required (provision via Replit or external provider)
- Connection string via `DATABASE_URL` environment variable

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migration tooling
- `@tanstack/react-query`: Async state management
- `@radix-ui/*`: Accessible UI primitives
- `zod` / `drizzle-zod`: Runtime validation and type generation
- `express-session` / `connect-pg-simple`: Session management with PostgreSQL storage

### Development Tools
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)
- esbuild for production server bundling

### Fonts (External)
- Google Fonts: Inter, JetBrains Mono, Orbitron
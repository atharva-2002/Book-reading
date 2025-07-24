# BookTrail - Reading Tracking Application

## Overview

BookTrail is a comprehensive reading tracking application that helps users discover, track, and review books. The application features a full-stack architecture with a React frontend and Express backend, designed to provide a seamless experience for book enthusiasts to manage their reading journey.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Architecture
The application follows a monorepo structure with three main directories:
- **client**: React frontend with TypeScript
- **server**: Express.js backend with TypeScript
- **shared**: Common schemas and types shared between frontend and backend

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Deployment**: Built for production with esbuild

## Key Components

### Frontend Architecture
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with CSS variables for theming support (light/dark modes)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: File-based routing with Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: Custom toast system for user feedback

### Backend Architecture
- **API Design**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL, using Neon as the database provider
- **Schema Validation**: Zod schemas shared between frontend and backend
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request logging middleware

### Database Design
The database schema includes:
- **Users**: User authentication and profile management
- **Books**: Book catalog with metadata (title, author, ISBN, cover images, etc.)
- **UserBooks**: Junction table tracking user-book relationships with reading status
- **Reviews**: User reviews with ratings and content
- **ReadingSessions**: Reading session tracking for calendar/progress features
- **UserPreferences**: User-specific settings and preferences

## Data Flow

### Client-Server Communication
1. **API Requests**: Frontend uses fetch with custom `apiRequest` helper
2. **Query Management**: TanStack Query handles caching, background updates, and optimistic updates
3. **Error Handling**: Centralized error handling with toast notifications
4. **Real-time Updates**: Query invalidation triggers UI updates

### Authentication Flow
- Currently uses mock authentication (currentUserId = 1)
- Session-based authentication prepared for implementation
- Protected routes and API endpoints ready for auth integration

### State Management Pattern
- **Server State**: Managed by TanStack Query with automatic caching
- **Local State**: React hooks for component-specific state
- **Form State**: React Hook Form for complex form management
- **UI State**: Local component state for modals, tabs, and interactions

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: For component variant management

### Database and Backend
- **Drizzle ORM**: Type-safe database interactions
- **Neon Database**: Serverless PostgreSQL provider
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast production builds for the backend

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with automatic restart on file changes
- **Database**: Migrations handled by Drizzle Kit

### Production Build
- **Frontend**: Static files built with Vite to `dist/public`
- **Backend**: Bundled with esbuild to `dist/index.js`
- **Database**: Schema changes applied via `drizzle-kit push`

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Build Process**: Separate build steps for frontend and backend
- **Static Serving**: Backend serves frontend static files in production

### Key Architectural Decisions

1. **Monorepo Structure**: Chosen for code sharing and simplified development workflow
2. **Drizzle ORM**: Selected for type safety and PostgreSQL compatibility over alternatives like Prisma
3. **TanStack Query**: Provides robust server state management with caching and optimistic updates
4. **shadcn/ui**: Offers consistent, accessible components while maintaining customization flexibility
5. **TypeScript Throughout**: Ensures type safety from database to UI components
6. **Shared Schema**: Single source of truth for data validation between frontend and backend

The application is designed to be scalable, maintainable, and user-friendly, with a focus on performance and developer experience.
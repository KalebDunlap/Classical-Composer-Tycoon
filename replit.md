# Classical Composer Tycoon

## Overview

A browser-based management/tycoon game where players take on the role of a 19th-century classical composer building their legacy in Europe. Inspired by "Game Dev Tycoon," players compose works, navigate patron relationships, schedule premieres, and rise to fame through strategic decisions about composition phases, venue selection, and career upgrades.

The game features a historical-modern hybrid aesthetic inspired by 19th-century ledgers and manuscript papers, with a target playtime of 10-20 minutes to reach the "minor famous composer" milestone.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Styling**: Tailwind CSS with custom design tokens matching a 19th-century ledger aesthetic
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **State Management**: React hooks with localStorage persistence for game saves
- **Data Fetching**: TanStack React Query (though primarily client-side game logic)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild bundling with selective dependency inlining

### Game Engine Design
The game logic is entirely client-side with these core modules:
- `gameTypes.ts`: Type definitions for compositions, venues, skills, events, and game state
- `gameState.ts`: State management, save/load functionality via localStorage, week advancement
- `gameEvents.ts`: Random event system with weighted choices and tradeoffs
- `compositionEngine.ts`: Quality calculations, premiere success formulas, title generation

### Layout Structure
Three-panel layout following the design guidelines:
- Left Sidebar (w-72): Resources panel showing money, reputation, inspiration, health, connections, and current date
- Main Content: Tabbed interface (Compose, Premiere, Career, Upgrades, History)
- Right Panel (w-80): Scrollable event chronicle/log

### Data Persistence
- **Primary**: Browser localStorage for game saves
- **Database Schema**: PostgreSQL with Drizzle ORM configured (users table exists for potential future multiplayer/cloud saves)
- **Session**: In-memory storage for development, PostgreSQL sessions available for production

## External Dependencies

### Database
- PostgreSQL with Drizzle ORM for schema management
- `drizzle-kit` for migrations (run `npm run db:push` to sync schema)
- `connect-pg-simple` for session storage

### UI Framework
- Radix UI primitives for accessible components
- shadcn/ui component patterns
- Lucide React for icons
- Google Fonts: Libre Baskerville, Playfair Display, Source Code Pro

### Build & Development
- Vite with React plugin
- Replit-specific plugins: runtime-error-modal, cartographer, dev-banner
- esbuild for production server bundling

### Key Libraries
- `date-fns`: Date formatting utilities
- `class-variance-authority`: Component variant styling
- `zod` + `drizzle-zod`: Schema validation
- `embla-carousel-react`: Carousel functionality
- `react-day-picker`: Calendar component
- `vaul`: Drawer component
- `cmdk`: Command palette
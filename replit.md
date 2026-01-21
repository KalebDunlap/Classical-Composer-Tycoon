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

## Recent Changes (January 2026)

### Completed Game Implementation
- Built complete game engine with composition quality calculation based on skills and phase allocation
- Implemented 7 composition forms: Piano Sonata, String Quartet, Symphony, Lied, Opera, Mass, Concerto
- Created 5 venues: Private Salon, Civic Hall, Court Theatre, Opera House, Grand Concert Hall
- Developed 12+ random events with meaningful choices affecting money, reputation, health, inspiration
- Added skill progression system with 5 levels (Novice → Master)
- Implemented 8 upgrades purchasable with money
- Added trend system that shifts every 3 in-game months
- Full localStorage save/load/reset functionality

### Game Components
- `StartScreen.tsx`: Initial game screen with new game/load/reset options
- `Game.tsx`: Main game container managing state and tab navigation
- `ResourcesSidebar.tsx`: Left panel showing money, reputation, skills, current trends
- `HomeTab.tsx`: Visual composer's study with 4 room tiers (Garret → Apartment → Grand Study → Country Retreat), piano upgrades, staff display, and activity status
- `ComposeTab.tsx`: Form/style/instrumentation selection and work-week allocation
- `PremiereTab.tsx`: Venue selection, musician hiring, patron dedication
- `CareerTab.tsx`: Composer profile and skill progression display
- `UpgradesTab.tsx`: Purchasable upgrades that improve composition quality
- `HistoryTab.tsx`: Catalogue of completed works and event chronicle
- `EventModal.tsx`: Random event popups with choice buttons
- `ResultsModal.tsx`: Post-premiere results with quality breakdown and review
- `LogPanel.tsx`: Right panel showing event chronicle

### Bug Fixes Applied
- Consolidated work week state updates to prevent race conditions (single onWorkWeek handler)
- Fixed Radix UI Select empty value error (use "none" instead of empty string)

### Navigation Improvements (January 2026)
- Added "Exit Game" button in header to return to main menu
- Added "Next Week" button in navigation bar to prevent game stagnation when short on funds
- Added "Home" tab as first tab showing composer's study visualization with:
  - 4 room tiers based on purchased upgrades (living category)
  - Piano type that changes with instrument upgrades
  - Staff members appear when copyist/assistant upgrades purchased
  - Animated composition activity indicators with thought bubble positioned to the left

### Audio System (January 2026)
- Background music by Kaleb Dunlap (credited on start screen)
- Two tracks: "Summer Overture" and "Allegretto Romantico"
- Autoplay on game start with random track selection
- Volume control panel with play/pause functionality

### Game Balance Overhaul (January 2026)
- **Quality Scoring Rebalanced**:
  - Diminishing returns on skills above level 15
  - Random "luck" factor (-10 to +8) simulating good/bad composition days
  - Steeper difficulty penalties for complex forms
  - Soft cap at 85 quality with diminishing returns above
  - Base quality now caps at 75 - bonuses required to reach higher scores
  - Perfect scores (95+) are now rare achievements
  
- **Passive Income System**:
  - Completed works have a "popularity" meter (0-100)
  - Popularity depletes weekly based on form complexity and quality
  - Higher quality and more complex works maintain popularity longer
  - Weekly royalties calculated from: (difficulty × 0.5) × (quality/100) × (popularity/100) × 2
  - ResourcesSidebar displays weekly publisher income when > 0
  - HistoryTab shows popularity meter and total royalties per piece
  
- **Revival Mechanic**:
  - After a piece loses all popularity and is 52+ weeks old, 3% weekly chance for revival offer
  - Only non-revival works with quality >= 50 can receive revival offers
  - Revival costs: 50 Thalers + 20 Inspiration
  - Revival creates new version with quality boost from improved skills
  - RevivalModal.tsx handles the revival offer UI
  
### New Game Components
- `AudioPlayer.tsx`: Background music player with volume control
- `RevivalModal.tsx`: Modal for accepting/declining revival opportunities
# Classical Composer Tycoon - Design Guidelines

## Design Approach

**Historical-Modern Hybrid**: Inspired by 19th-century ledgers, manuscript papers, and concert programs while maintaining modern game UI clarity. Think Game Dev Tycoon meets period-appropriate aesthetics without sacrificing readability.

## Typography System

**Primary Font**: Serif font family (Georgia, Playfair Display, or Crimson Text via Google Fonts)
- Headings: 2xl-4xl, semibold to bold
- Body text: base to lg, regular weight
- Stats/numbers: lg, medium weight with slight letter-spacing

**Secondary Font**: Monospace for numerical data (Courier New or Roboto Mono)
- Resource counters, dates, monetary values

**Hierarchy**:
- Page titles: text-3xl font-bold
- Section headers: text-xl font-semibold
- Tab labels: text-base font-medium uppercase tracking-wide
- Body content: text-base
- Small labels/metadata: text-sm

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: p-6
- Button padding: px-6 py-3

**Grid Structure**:
```
├── Left Sidebar (w-64 to w-80): Fixed resources/stats panel
├── Main Content Area (flex-1): Tabbed interface
└── Right Log Panel (w-72 to w-96): Scrollable event feed
```

Mobile: Stack vertically, collapsible sidebar/log

## Core Components

### Sidebar - Resources Panel
- Bordered container with subtle paper texture suggestion
- Stack of stat blocks with icons (Money 💰, Reputation ⭐, Inspiration 💡, Health ❤️)
- Current date prominently displayed at top in decorative frame
- Each stat: Label + large number + small trend indicator (↑↓)

### Main Tabbed Interface
**Tab Navigation**: Horizontal tabs with underline indicator
- Tabs: Compose | Premiere | Career | Upgrades | History
- Active tab uses border-b-2 treatment

**Tab Content Patterns**:

**Compose Tab**:
- Form selection: Grid of cards (grid-cols-2 lg:grid-cols-3, gap-4)
- Each card: Form name, difficulty badge, unlock status
- Time allocation: Horizontal slider bars for each phase
- Week simulator: Multi-column table showing daily breakdown

**Premiere Tab**:
- Venue selection: List with expandable details
- Musician hiring: Checkbox grid with quality tiers
- Preview panel: Summary card with estimated outcomes

**Career Tab**:
- Skills: Progress bars with level indicators
- Achievements: Icon grid with tooltips
- Reputation graph: Simple line chart

**Upgrades Tab**:
- Shop interface: 2-column grid of upgrade cards
- Each card: Icon, title, cost, benefit description, purchase button

**History Tab**:
- Chronological list of completed works
- Expandable accordion entries with premiere details

### Event System
- Modal overlays for important events (max-w-2xl)
- Event card structure: Title, narrative text, 2-4 choice buttons
- Consequences shown in smaller text below choices

### Results Screen (Post-Premiere)
- Full modal overlay with dramatic presentation
- Top: Work title in large decorative text
- Middle: Review quote in italicized block
- Stats grid: 2x2 showing earnings/reputation changes with +/- indicators
- Bottom: Factors breakdown accordion
- Close/Continue button

### Log Panel
- Reverse chronological feed
- Each entry: Timestamp + icon + event text
- Recent entries highlighted with subtle border
- Scrollable with fade-out at top

## Component Library

**Cards**: Bordered rectangles with subtle shadow, rounded-lg
- Padding: p-6
- Hover state: slight shadow increase

**Buttons**:
- Primary: Solid fill, px-6 py-3, rounded-md, font-medium
- Secondary: Bordered, same padding
- Disabled: Reduced opacity

**Progress Bars**: 
- Container: h-4, rounded-full, bordered
- Fill: Gradient suggestion for elegance

**Tables**:
- Bordered rows, alternating subtle background
- Headers: font-semibold, border-b-2

**Badges**: Small pill-shaped labels (px-3 py-1, text-sm, rounded-full)

**Input Fields**: Bordered with focus ring, px-4 py-2

## Decorative Elements

**Borders**: Use varied border styles
- Single borders for containers
- Double borders (border-y + inner pseudo-element) for special headers
- Corner ornaments using CSS (optional flourishes)

**Icons**: Font Awesome (solid and regular styles)
- Musical notes, coins, stars, hearts, arrows
- Venue types, instrument categories

**Texture Suggestions**: 
- Subtle paper grain via background patterns (very light opacity)
- Ink splatter or manuscript-style decorations for headers (minimal)

## Animations

**Minimal Approach**:
- Smooth transitions on tab switches (transition-all duration-200)
- Gentle fade-in for modals
- Number counting animation for stat changes (brief)
- Progress bar fills

**NO**: Distracting parallax, excessive hover effects, or autoplay animations

## Special Screens

**Start Screen**:
- Centered card (max-w-md)
- Game title in large decorative serif
- New Game / Load Game / Reset buttons stacked vertically
- Brief tagline in italics

**Save/Load Interface**:
- List of save slots with timestamps
- Preview information (current year, reputation, works completed)

## Responsive Behavior

**Desktop (lg:)**: Full three-column layout
**Tablet (md:)**: Collapsible sidebar, full log panel
**Mobile (base)**: 
- Hamburger menu for sidebar
- Log panel accessible via bottom drawer
- Single-column grids throughout
- Larger tap targets (min-h-12)

## Key Design Principles

1. **Information Clarity**: Stats and numbers always readable, never obscured
2. **Period Flavor**: Typography and borders evoke 19th-century, not literal skeuomorphism
3. **Hierarchy**: Clear visual distinction between chrome (UI) and content
4. **Scannable**: Important information (resources, current task) always visible
5. **Balanced Density**: Information-rich without overwhelming

This design creates an elegant, period-appropriate aesthetic that serves the complex game mechanics while remaining clean and navigable.
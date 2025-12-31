# AGENTS.md - Codebase Guide for AI Assistants

This document provides a comprehensive overview of the slides.md codebase architecture, patterns, and conventions to help AI assistants understand and work with the codebase effectively.

## ⚠️ Critical: Verification Step

**Before committing any refactoring (small or large), ALWAYS run:**
```bash
pnpm check
```

This command runs both ESLint and TypeScript type checking (`eslint . && tsc -b --noEmit`). It's a mandatory verification step to ensure code quality and type safety.

## Architecture Overview

slides.md is a **React + TypeScript + Vite** application that converts Markdown into slide presentations. The app uses a client-side architecture with IndexedDB for persistence.

### Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18 (via @tailwindcss/vite)
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Markdown Parser**: marked.js 17.0.1 with custom extensions
- **Syntax Highlighting**: highlight.js 11.11.1
- **Database**: Dexie.js 4.2.1 (IndexedDB wrapper)
- **UI Components**: Radix UI (Dialog, Switch, Slot)
- **Utilities**: clsx, tailwind-merge, date-fns

## Project Structure

```
src/
├── App.tsx                 # Main application component (orchestrates state & views)
├── main.tsx                # React entry point
├── index.css               # Global styles & Tailwind imports
├── components/             # React components
│   ├── Button.tsx          # Reusable button component (Radix Slot-based)
│   ├── Director.tsx        # Wrapper for slide navigation (delegates to SlideNav)
│   ├── Editor.tsx          # Monaco editor component (standard view)
│   ├── FullscreenEditor.tsx # Fullscreen Monaco editor view
│   ├── GettingStartedModal.tsx # Help modal with LLM prompt
│   ├── PresentationView.tsx   # Fullscreen presentation mode
│   ├── Slide.tsx           # Individual slide renderer (marked.js + highlight.js)
│   ├── SlideNav.tsx        # Slide navigation controls (prev/next buttons)
│   └── StandardView.tsx    # Main split-pane view (editor + preview)
├── hooks/                  # Custom React hooks
│   ├── useFullscreen.ts    # Browser fullscreen API wrapper (vendor-prefixed)
│   ├── useKeyboardNavigation.ts # Global keyboard shortcuts handler
│   ├── useLocalStorage.ts  # localStorage hook (unified preferences object)
│   └── useSlides.ts        # Markdown → slides parser (frontmatter + split)
├── utils/                  # Utility functions
│   ├── cn.ts               # className merger (clsx + tailwind-merge)
│   └── parseFrontmatter.ts # Frontmatter parser (===/=== delimiter)
├── db/                     # Database layer
│   ├── adapter.ts          # DatabaseAdapter interface (abstraction)
│   ├── index.ts            # Singleton db instance export
│   └── indexeddbAdapter.ts # IndexedDB implementation (Dexie)
└── data/
    └── seed.md             # Initial presentation content (loaded on first run)
```

## Core Data Flow

### 1. Application Initialization

```
main.tsx → App.tsx
  ↓
App.tsx mounts → loads from IndexedDB (via db.getPresentation)
  ↓
If empty DB → IndexedDBAdapter.initialize() → seeds from seed.md
  ↓
Markdown state set → useSlides hook parses → slides array created
```

### 2. Markdown Editing Flow

```
User edits in Monaco Editor
  ↓
setMarkdown called → markdown state updates
  ↓
useSlides hook re-parses → frontmatter + slides array updated
  ↓
Debounced save (500ms) → db.savePresentation → IndexedDB
```

### 3. Presentation Flow

```
StandardView → User clicks "Present" or presses ⌘↵
  ↓
isFullscreen = true → App.tsx renders PresentationView
  ↓
PresentationView → requests browser fullscreen → shows current slide
  ↓
Keyboard navigation (arrows) → updates currentSlide
```

## Component Architecture

### App.tsx (Root Component)

**Responsibilities:**
- Manages global state (markdown, currentSlide, isFullscreen, isEditorFullscreen, isDark)
- Handles IndexedDB loading/saving (debounced)
- Routes between three views: StandardView, PresentationView, FullscreenEditor
- Applies dark mode class to document root

**Key Patterns:**
- Uses `useRef` for debounced save timeout
- Uses `useCallback` for memoized handlers
- Type-safe theme state wrapper (ensures boolean, not undefined)

### StandardView Component

**Layout:**
- Split-pane view: Editor (left) + Preview (right)
- Responsive: On mobile (<1200px), shows one pane at a time with toggle switch
- Header with theme toggle and getting started link

**Key Features:**
- Editor pane: Monaco editor with toolbar (Clear, Copy, Fullscreen)
- Preview pane: Current slide preview with navigation controls
- Director component: Slide navigation (prev/next buttons + slide counter)

### PresentationView Component

**Fullscreen presentation mode:**
- Fixed inset layout with top bar (Exit, Reset, Theme buttons)
- Slide content centered with title slide special handling
- Director component at bottom for navigation
- Uses `useFullscreen` hook for browser fullscreen API

**Title Slide Handling:**
- If frontmatter exists, first slide is `"__TITLE_SLIDE__"` special marker
- Slide component renders custom title slide UI when `isTitle={true}`

### Slide Component

**Markdown Rendering:**
- Uses `marked.js` with custom extensions:
  - `standaloneTodoExtension`: Standalone `[ ]` and `[x]` checkboxes
  - `parenOrderedListExtension`: `1) 2) 3)` style ordered lists
- Syntax highlighting via `highlight.js` (auto-detect or language-specific)
- Custom code renderer extracts inner HTML from highlight.js output

**Title Slide:**
- Special rendering when `isTitle={true}` and `frontmatter` provided
- Shows: title (large), description, presenter, formatted date

### Editor Components

**Editor.tsx (Standard View):**
- Monaco editor with markdown language support
- Toolbar: Fullscreen, Clear, Copy buttons
- Theme syncs with app dark mode

**FullscreenEditor.tsx:**
- Full-screen Monaco editor
- Uses `useFullscreen` hook for browser fullscreen
- Top bar with Clear, Copy, Exit buttons

## Custom Hooks

### useSlides

**Purpose:** Parse markdown into frontmatter and slides array

**Logic:**
1. Calls `parseFrontmatter` to extract `===/===` delimited metadata
2. Splits remaining content by `===` to create slides
3. Filters trailing empty slides (keeps intentional empty slides)
4. If frontmatter exists, prepends `"__TITLE_SLIDE__"` marker

**Returns:** `{ frontmatter: Record<string, string>, slides: string[] }`

### useKeyboardNavigation

**Global keyboard shortcuts:**
- `ArrowRight/Left`: Navigate slides (skipped if editing in input/textarea/editor)
- `⌘/Ctrl + Enter`: Enter presentation mode
- `⌘/Ctrl + T`: Toggle theme (standard view)
- `ESC`: Exit fullscreen modes
- `R`: Reset deck to slide 0 (presentation mode)
- `T`: Toggle theme (presentation mode)

**Key Detail:** Checks if user is editing (input/textarea/contenteditable/Monaco) before handling arrow keys

### useFullscreen

**Purpose:** Browser fullscreen API wrapper with vendor prefix support

**Features:**
- Supports webkit, moz, ms prefixes
- Handles ESC key to exit
- Listens to fullscreen change events
- Provides `requestFullscreenOnly` and `toggleFullscreen` functions

### useLocalStorage

**Purpose:** Unified localStorage hook for user preferences

**Pattern:**
- All preferences stored under single key: `"slides-md-user-preferences"`
- Returns `[value, setValue]` tuple like `useState`
- Skips save on initial mount to avoid overwriting with defaults

**Usage:**
```typescript
const [theme, setTheme] = useLocalStorage("theme", false);
// Stores: { theme: false, ...otherPrefs }
```

## Database Layer

### Adapter Pattern

**Interface:** `DatabaseAdapter` (in `db/adapter.ts`)
- Abstraction allows switching backends (IndexedDB → PostgreSQL, etc.)
- Methods: `getPresentation`, `savePresentation`, `getAllPresentations`, `deletePresentation`

**Current Implementation:** `IndexedDBAdapter` (in `db/indexeddbAdapter.ts`)
- Uses Dexie.js for IndexedDB
- Database name: `"SlidesMD"`
- Table: `presentations` (indexed by id, name, createdAt, updatedAt)

### Initialization & Seeding

**Flow:**
1. `IndexedDBAdapter.initialize()` called on first access
2. Database is initialized and ready for use
3. No auto-seeding - HomePage handles empty state
4. Users create presentations manually, each with a UUID as the id

**Key Detail:** Initialization is lazy and idempotent (uses `initialized` flag). All presentations use UUIDs for their IDs (generated via `generateUUID()` from `src/utils/uuid.ts`).

### Presentation Model

```typescript
interface Presentation {
  id: string;
  name: string;
  markdown: string;
  createdAt: number;  // timestamp
  updatedAt: number;  // timestamp
}
```

## Markdown Parsing

### Frontmatter Format

**Delimiter:** `===/===` (not standard YAML `---`)

**Example:**
```
===/===
title: My Presentation
date: 2025-01-01
presenter: Your Name
description: A brief summary
===/===
```

**Key Aliases:** `parseFrontmatter` normalizes keys:
- `presenters`, `author`, `authors`, `by` → `presenter`
- `subtitle` → `description`

### Slide Separation

**Delimiter:** `===` (three equals signs on a line)

**Example:**
```
# Slide 1
Content here

===

# Slide 2
More content
```

**Edge Cases:**
- Trailing empty slides after last `===` are filtered out
- Intentional empty slides (between two `===`) are kept

### Custom Markdown Extensions

**1. Standalone Todo Items:**
```
[ ] Unchecked item
[x] Checked item
```
Renders as checkbox inputs (not list items)

**2. Parentheses Ordered Lists:**
```
1) First item
2) Second item
3) Third item
```
Renders as `<ol>` list

## Styling & Theming

### Tailwind CSS

- Uses Tailwind 4.x with Vite plugin
- Dark mode via `dark:` prefix (controlled by `dark` class on `document.documentElement`)
- Responsive breakpoints: `sm:` (640px+), `min-[1200px]:` (1200px+)

### Theme Management

**State:** `isDark` boolean (stored in localStorage via `useLocalStorage`)

**Application:**
- `App.tsx` adds/removes `dark` class on `document.documentElement`
- Monaco editor theme: `isDark ? "vs-dark" : "vs"`
- Tailwind classes use `dark:` variants

## Key Patterns & Conventions

### 1. Component Props

- Props are explicitly typed with TypeScript interfaces
- Optional props use `?` (e.g., `frontmatter?: Record<string, string>`)
- Callback props use descriptive names (e.g., `onClear`, `onCopy`, `toggleFullscreen`)

### 2. State Management

- Local component state via `useState`
- Global app state in `App.tsx` (markdown, currentSlide, etc.)
- Persistence: IndexedDB for markdown, localStorage for preferences

### 3. Debouncing

- Markdown saves are debounced (500ms) to avoid excessive IndexedDB writes
- Uses `window.setTimeout` with cleanup in `useEffect`

### 4. Error Handling

- Database operations wrapped in try/catch with console.error
- Fullscreen API failures handled gracefully (console.error, no crashes)

### 5. Accessibility

- Radix UI components provide ARIA attributes
- Keyboard navigation throughout
- Touch-friendly buttons (`touch-manipulation` class)

## Important Notes for Refactoring

### 1. Type Safety

- All components are TypeScript with strict typing
- Use `pnpm check` to verify types before committing
- Be careful with `Record<string, string>` types (frontmatter)

### 2. State Synchronization

- Markdown state must stay in sync with IndexedDB
- Debounced saves mean recent edits might not be persisted immediately
- `isLoading` flag prevents saves during initial load

### 3. Fullscreen API

- Browser fullscreen requires user gesture (can't be called programmatically on load)
- Vendor prefixes needed for cross-browser support
- ESC key handling must coordinate with app state

### 4. Monaco Editor

- Monaco is a large dependency (~2MB)
- Editor instance is managed by `@monaco-editor/react`
- Theme changes require re-render (handled automatically)

### 5. Markdown Parsing

- `marked.js` is configured globally (extensions added once)
- Custom extensions must match TokenizerExtension & RendererExtension interface
- Code highlighting happens after render (useEffect in Slide component)

### 6. Database Migrations

- Dexie schema versioning: currently version 1
- Future migrations: increment version, add migration logic in `version(2).stores(...)`

### 7. Mobile Responsiveness

- StandardView uses conditional rendering for mobile (<1200px)
- Editor/Preview toggle switch on mobile
- Touch-friendly button sizes and spacing

## Testing Considerations

- No test files currently (consider adding Vitest + React Testing Library)
- Key areas to test:
  - Markdown parsing (frontmatter, slide splitting)
  - Keyboard navigation
  - Fullscreen API interactions
  - IndexedDB persistence

## Future Extension Points

1. **Multiple Presentations**: UI for managing multiple presentations (currently single "default")
2. **Export**: PDF/HTML export functionality
3. **Themes**: Custom presentation themes (beyond light/dark)
4. **Collaboration**: Real-time editing (WebSockets + backend)
5. **Backend Switch**: Replace IndexedDBAdapter with REST API adapter

## Common Tasks

### Adding a New Keyboard Shortcut

1. Add handler in `useKeyboardNavigation.ts`
2. Update `GettingStartedModal.tsx` documentation
3. Test in both standard and presentation views

### Adding a New Frontmatter Field

1. Update `parseFrontmatter.ts` if normalization needed
2. Update `Slide.tsx` title slide rendering if display needed
3. Update `GettingStartedModal.tsx` documentation

### Changing Database Backend

1. Create new adapter implementing `DatabaseAdapter` interface
2. Update `db/index.ts` to export new adapter
3. Ensure initialization/seeding logic matches IndexedDBAdapter pattern

---

**Remember: Always run `pnpm check` before committing any changes!**


# slides.md

# Minimal Markdown Presentation App

**slides.md** is a lightweight, open source web application for creating and delivering slide presentations authored in Markdown. The application focuses on simplicity, performance, and clarity, enabling users to convert Markdown notes into structured presentations with minimal effort.

## Demo

[Live demo](https://slides-md.netlify.app/)

## Features

* **Multiple Presentations**: Create and manage multiple presentations (up to 50) with unique names and IDs.
* Live Markdown editing with immediate slide preview.
* Fullscreen presentation mode with keyboard controls.
* Frontmatter support for titles, descriptions, and presenter information.
* Image-only slides automatically fill the entire slide area.
* Adjustable editor and preview panes.
* Light and dark theme options.
* Quick actions to copy the Markdown or clear the editor content.
* Automatic persistence to IndexedDB (browser storage).
* Responsive design with mobile-friendly editor/preview toggle.
* Gallery and list view modes for browsing presentations.

## Quick Start

1. Install dependencies

   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. Start the development server

   ```sh
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in a browser.

## Development

### Verification Step

**⚠️ Important:** Before committing any changes (refactoring, new features, or bug fixes), always run:

```sh
pnpm check
```

This command verifies code quality by running ESLint and TypeScript type checking. It's a mandatory step to ensure the codebase remains maintainable and type-safe.

### Available Scripts

* `pnpm dev` - Start development server
* `pnpm build` - Build for production
* `pnpm preview` - Preview production build
* `pnpm lint` - Run ESLint
* `pnpm check` - Run ESLint + TypeScript type checking (use before committing)

## Usage

### Creating Presentations

* From the home page, click "New Presentation" or press `Cmd/Ctrl+N` to create a new presentation.
* You can also add a sample presentation to get started quickly.
* Each presentation has a unique ID and can be renamed, edited, or deleted.

### Editing Presentations

* Click on a presentation card or table row to open it for editing.
* Write slides in the left pane using Markdown. Separate slides with `===`.
* Add optional frontmatter at the beginning:

  ```
  @@@
  title: My Talk Title
  presenter: Your Name
  description: Short description
  @@@
  ```
* Enter presentation mode by selecting Present or pressing `Cmd/Ctrl+Enter`.
* Navigate with the arrow keys. Press `R` to reset, `T` to toggle the theme, and `ESC` to exit presentation mode.

## Project Structure

* `src/` - Main source directory
  * `App.tsx` - Application root component (router provider, theme management)
  * `main.tsx` - React entry point
  * `router.tsx` - TanStack Router configuration (routes for home and presentation pages)
  * `pages/` - Page-level components
    * `HomePage.tsx` - Home page with presentation gallery/list view and creation
    * `PresentationPage.tsx` - Individual presentation editor and viewer
  * `components/` - React UI components
    * `AppHeader.tsx` - Application header with title and theme toggle
    * `Editor.tsx` - Monaco editor component (standard view)
    * `FullscreenEditor.tsx` - Fullscreen editor mode
    * `PresentationView.tsx` - Fullscreen presentation mode
    * `StandardView.tsx` - Split-pane editor/preview view
    * `StandardViewNav.tsx` - Navigation bar for standard view
    * `Slide.tsx` - Individual slide renderer (Markdown → HTML)
    * `SlideNav.tsx` - Slide navigation controls
    * `Director.tsx` - Navigation wrapper component
    * `GettingStartedModal.tsx` - Help modal with usage instructions
    * `CreatePresentationDialog.tsx` - Dialog for creating new presentations
    * `EditPresentationNameDialog.tsx` - Dialog for editing presentation names
    * `DeleteConfirmationDialog.tsx` - Confirmation dialog for deleting presentations
    * `PresentationCard.tsx` - Card component for gallery view
    * `PresentationListItem.tsx` - List item component for table view
    * `PresentationsTable.tsx` - Table view for presentations list
  * `ui/` - Reusable UI components
    * `Button.tsx` - Reusable button component (Radix Slot-based)
    * `Switch.tsx` - Toggle switch component
    * `ThemeToggleButton.tsx` - Theme toggle button component
  * `hooks/` - Custom React hooks
    * `useSlides.ts` - Markdown parsing (frontmatter + slide splitting)
    * `useKeyboardNavigation.ts` - Global keyboard shortcuts
    * `useFullscreen.ts` - Browser fullscreen API wrapper
    * `useLocalStorage.ts` - LocalStorage hook for preferences
  * `utils/` - Utility functions
    * `parseFrontmatter.ts` - Frontmatter parser (`@@@` delimiter)
    * `cn.ts` - className utility (clsx + tailwind-merge)
    * `uuid.ts` - UUID generation utility
  * `config/` - Configuration files
    * `constants.ts` - Global application constants (e.g., MAX_PRESENTATIONS)
  * `db/` - Database layer
    * `adapter.ts` - Database adapter interface (abstraction)
    * `indexeddbAdapter.ts` - IndexedDB implementation (Dexie.js)
    * `index.ts` - Database singleton export
  * `data/` - Sample content
    * `seed.md` - Sample presentation markdown (used for "Add Sample Presentation")

## Technical Details

* **Routing**: Uses TanStack Router for client-side routing with two main routes:
  * `/` - Home page (presentation gallery/list)
  * `/presentation/$id` - Individual presentation editor/viewer
* **Persistence**: Presentations are automatically saved to IndexedDB (browser storage) with a 500ms debounce to avoid excessive writes. Each presentation has a unique UUID and is stored with metadata (name, createdAt, updatedAt).
* **Multiple Presentations**: Supports up to 50 presentations (configurable via `MAX_PRESENTATIONS` constant). Each presentation is stored independently in IndexedDB.
* **Markdown Parsing**: Uses `marked.js` with custom extensions for standalone checkboxes (`[ ]`, `[x]`) and parentheses-ordered lists (`1)`, `2)`, etc.).
* **Syntax Highlighting**: Code blocks are highlighted using `highlight.js` with automatic language detection.
* **Editor**: Monaco Editor provides a VS Code-like editing experience with syntax highlighting and IntelliSense for Markdown.

For a comprehensive guide to the codebase architecture, see [AGENTS.md](./AGENTS.md).

## License

MIT

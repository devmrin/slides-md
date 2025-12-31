# slides.md

# Minimal Markdown Presentation App

**slides.md** is a lightweight, open source web application for creating and delivering slide presentations authored in Markdown. The application focuses on simplicity, performance, and clarity, enabling users to convert Markdown notes into structured presentations with minimal effort.

## Demo

[Live demo](https://slides-md.netlify.app/)

## Features

* Live Markdown editing with immediate slide preview.
* Fullscreen presentation mode with keyboard controls.
* Frontmatter support for titles, descriptions, and presenter information.
* Adjustable editor and preview panes.
* Light and dark theme options.
* Quick actions to copy the Markdown or reset to the sample content.
* Automatic persistence to IndexedDB (browser storage).
* Responsive design with mobile-friendly editor/preview toggle.

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

* Write slides in the left pane using Markdown. Separate slides with `===`.
* Add optional frontmatter at the beginning:

  ```
  ===/===
  title: My Talk Title
  presenter: Your Name
  description: Short description
  ===/===
  ```
* Enter presentation mode by selecting Present or pressing Cmd+Enter.
* Navigate with the arrow keys. Press R to reset, T to toggle the theme, and ESC to exit presentation mode.

## Project Structure

* `src/` - Main source directory
  * `App.tsx` - Application root component (state management, view routing)
  * `components/` - React UI components
    * `Editor.tsx` - Monaco editor component (standard view)
    * `FullscreenEditor.tsx` - Fullscreen editor mode
    * `PresentationView.tsx` - Fullscreen presentation mode
    * `StandardView.tsx` - Split-pane editor/preview view
    * `Slide.tsx` - Individual slide renderer (Markdown → HTML)
    * `SlideNav.tsx` - Slide navigation controls
    * `Director.tsx` - Navigation wrapper component
    * `Button.tsx` - Reusable button component
    * `GettingStartedModal.tsx` - Help modal with usage instructions
  * `hooks/` - Custom React hooks
    * `useSlides.ts` - Markdown parsing (frontmatter + slide splitting)
    * `useKeyboardNavigation.ts` - Global keyboard shortcuts
    * `useFullscreen.ts` - Browser fullscreen API wrapper
    * `useLocalStorage.ts` - LocalStorage hook for preferences
  * `utils/` - Utility functions
    * `parseFrontmatter.ts` - Frontmatter parser (`===/===` delimiter)
    * `cn.ts` - className utility (clsx + tailwind-merge)
  * `db/` - Database layer
    * `adapter.ts` - Database adapter interface (abstraction)
    * `indexeddbAdapter.ts` - IndexedDB implementation (Dexie.js)
    * `index.ts` - Database singleton export
  * `data/` - Sample content
    * `seed.md` - Initial presentation (loaded on first run)

## Technical Details

* **Persistence**: Presentations are automatically saved to IndexedDB (browser storage) with a 500ms debounce to avoid excessive writes.
* **Markdown Parsing**: Uses `marked.js` with custom extensions for standalone checkboxes (`[ ]`, `[x]`) and parentheses-ordered lists (`1)`, `2)`, etc.).
* **Syntax Highlighting**: Code blocks are highlighted using `highlight.js` with automatic language detection.
* **Editor**: Monaco Editor provides a VS Code-like editing experience with syntax highlighting and IntelliSense for Markdown.

For a comprehensive guide to the codebase architecture, see [AGENTS.md](./AGENTS.md).

## License

MIT

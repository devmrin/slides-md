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

* `src/` main source directory

  * `App.tsx` application entry point
  * `components/` user interface components such as Editor, Slide, and Director
  * `hooks/` custom React hooks for slide parsing, fullscreen logic, and related behavior
  * `utils/` utility functions including frontmatter parsing
  * `data/` sample Markdown content

## License

MIT

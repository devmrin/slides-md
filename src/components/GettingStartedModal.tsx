import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "./Button";

export function GettingStartedModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="text-xs ml-2 opacity-70 underline cursor-pointer hover:opacity-100 transition-opacity text-gray-900 dark:text-gray-100"
          type="button"
        >
          how do I present a markdown?
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 border border-gray-300 dark:border-gray-700">
          <div className="p-6 relative">
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                aria-label="Close"
                type="button"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </Dialog.Close>
            <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 pr-12 sm:pr-16">
              Getting Started with slides.md
            </Dialog.Title>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">

              {/* Overview */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Overview
                </h2>
                <p className="leading-relaxed">
                  slides.md turns Markdown into presentations. Add optional frontmatter for metadata, separate slides with <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">===</code>, and you're done.
                </p>
              </section>

              {/* Frontmatter */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Frontmatter (Optional)
                </h2>
                <p className="leading-relaxed">
                  Add metadata at the top of your file using the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">===/===</code> delimiter:
                </p>

                <div className="mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs overflow-x-auto border border-gray-700 dark:border-gray-600 font-mono text-gray-100 dark:text-gray-200 whitespace-pre">
                  {`===/===
title: My Presentation
date: 2025-01-01
presenter: Your Name
description: A brief summary
===/===`}
                </div>
              </section>

              {/* Slide Separation */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Slide Separation
                </h2>
                <p className="leading-relaxed">
                  Use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">===</code> on its own line to separate slides:
                </p>

                <div className="mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs overflow-x-auto border border-gray-700 dark:border-gray-600 font-mono text-gray-100 dark:text-gray-200 whitespace-pre">
                  {`# First Slide
Content here

===

# Second Slide
More content`}
                </div>
              </section>

              {/* Writing Slides */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Supported Markdown
                </h2>
                <ul className="text-sm list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                  <li>Headings, lists, blockquotes</li>
                  <li>Fenced code blocks with syntax highlighting</li>
                </ul>
              </section>

              {/* Presentation Mode */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Presenting
                </h2>
                <p className="leading-relaxed">
                  Click "Present" to enter fullscreen. Use arrow keys or on-screen controls to navigate.
                </p>
              </section>

              {/* Keyboard Shortcuts */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Keyboard Shortcuts
                </h2>
                <ul className="text-sm list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">F</kbd>
                    <span>Toggle fullscreen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">→</kbd>
                    <span>Next slide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">←</kbd>
                    <span>Previous slide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">^T</kbd>
                    <span>Toggle dark mode</span>
                  </li>
                </ul>
              </section>

              {/* LLM Prompt */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  LLM Prompt
                </h2>
                <p className="leading-relaxed mb-3">
                  Use this prompt to generate slides.md-compatible presentations:
                </p>

                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-gray-700 dark:border-gray-600 text-sm font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap">
                  {`FORMAT CONTRACT (slides.md)

1. Output type
Respond with a single text document for slides.md.

2. Frontmatter
Start with:
  ===/===
  title: ...
  date: YYYY-MM-DD
  presenter: ...
  description: ...
  ===/===

3. Slide separation
Separate slides with a line containing exactly:
  ===

4. Code fences (IMPORTANT)
Use DOUBLE backticks for code blocks:
  \`\`lang
  code...
  \`\`
Inline code uses single backticks: \`like this\`

5. Allowed Markdown
Headings (#, ##, ###), lists, blockquotes.

6. No extra commentary
Output only the deck content.

---
[INSERT YOUR TOPIC OR CONTENT HERE]`}
                </div>
              </section>
            </div>

            <div className="mt-8 flex justify-end  pt-6">
              <Dialog.Close asChild>
                <Button
                  className="px-4 py-2 text-sm border rounded-md border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

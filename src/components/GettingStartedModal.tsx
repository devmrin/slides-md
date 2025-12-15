import * as Dialog from "@radix-ui/react-dialog";
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
          <div className="p-6">
            <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Getting Started with slides.md
            </Dialog.Title>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">

              {/* Overview */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Overview
                </h2>
                <p className="leading-relaxed">
                  slides.md lets you create presentations using plain Markdown. Your file defines metadata through a fixed frontmatter block and divides content into slides using a dedicated delimiter. The result is a clean, predictable workflow suited for technical content.
                </p>
              </section>

              {/* Frontmatter */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Required Frontmatter
                </h2>
                <p className="leading-relaxed">
                  Each presentation begins with an optional frontmatter block enclosed by the delimiter shown below. The available fields are fixed and must appear at the top of the file.
                </p>

                <div className="mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs overflow-x-auto border border-gray-700 dark:border-gray-600 font-mono text-gray-100 dark:text-gray-200 whitespace-pre">
{`===/===
title: A Brief, Questionable History of Compilers
date: 2025-01-01
presenter: Mrinmay
description: How we went from punch cards to React spaghetti
===/===`}
                </div>

                <p className="mt-3 text-sm leading-relaxed">
                  The system reads this block before rendering your slides. Your primary markdown content will come after this block.
                </p>
              </section>

              {/* Slide Separation */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Slide Separation
                </h2>
                <p className="leading-relaxed">
                  Individual slides are separated with a triple equals delimiter. Everything between two delimiters is treated as one slide.
                </p>

                <div className="mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs overflow-x-auto border border-gray-700 dark:border-gray-600 font-mono text-gray-100 dark:text-gray-200 whitespace-pre">
{`# First Slide
Content here

===

# Second Slide
More content`}
                </div>

                <p className="mt-3 text-sm leading-relaxed">
                  You can include any Markdown element such as headings, lists, fenced code blocks, and diagrams.
                </p>
              </section>

              {/* Writing Slides */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Writing Effective Slides
                </h2>
                <ul className="text-sm list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                  <li>Use headings to establish structure.</li>
                  <li>Keep each slide narrowly focused.</li>
                  <li>Prefer lists and concise text for readability.</li>
                  <li>Use fenced code blocks for technical examples.</li>
                  <li>Place diagrams, ASCII art, or mermaid blocks directly where needed.</li>
                </ul>
              </section>

              {/* Presentation Mode */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Preview and Present
                </h2>
                <p className="leading-relaxed">
                  The preview pane reflects changes as you edit your Markdown. When ready, select the presentation mode option to launch a full screen view. Navigation follows common slide deck conventions using arrow keys or on screen controls.
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
                  Optional LLM Prompt
                </h2>
                <p className="leading-relaxed mb-3">
                  You can use this prompt to convert existing Markdown into a presentation compatible with slides.md.
                </p>

                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-gray-700 dark:border-gray-600 text-sm font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap">
{`Convert the following content into a slides.md presentation. Use:

1. A frontmatter block enclosed in triple equals slash triple equals
2. The fields: title, date, presenter, description
3. Triple equals delimiters to separate slides
4. Concise, well structured slides
5. Appropriate Markdown formatting

Here is my content:

[Paste your Markdown content here]`}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Replace the placeholder with your content and the model will restructure it accordingly.
                </p>
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

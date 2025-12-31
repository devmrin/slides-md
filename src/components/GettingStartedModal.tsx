import * as Dialog from "@radix-ui/react-dialog";
import { X, Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "../ui/Button";

export function GettingStartedModal() {
  const [copied, setCopied] = useState(false);
  const [frontmatterCopied, setFrontmatterCopied] = useState(false);

  const llmPrompt = `FORMAT CONTRACT (slides.md)

1. Output type
Respond with a single text document for slides.md.

2. Frontmatter
Start with:
  @@@
  title: ...
  date: YYYY-MM-DD
  presenter: ...
  description: ...
  @@@

3. Slide separation
Separate slides with a line containing exactly:
  ===

4. Code fences
Use TRIPLE backticks for code blocks:
  \`\`\`lang
  code...
  \`\`\`
Inline code uses single backticks: \`like this\`

5. Allowed Markdown
Headings (#, ##, ###), lists, blockquotes, checkboxes

6. No extra commentary
Output only the deck content.

---
[INSERT YOUR TOPIC OR CONTENT HERE]`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(llmPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyFrontmatter = async () => {
    const sampleFrontmatter = `@@@
title: Sample presentation
description: Add presentation description
date: ${format(new Date(), "yyyyMMdd")}
presenter: My team
@@@
`;
    try {
      await navigator.clipboard.writeText(sampleFrontmatter);
      setFrontmatterCopied(true);
      setTimeout(() => setFrontmatterCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
              <Button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
                aria-label="Close"
                type="button"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </Dialog.Close>
            <Dialog.Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 pr-12 sm:pr-16">
              Overview
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Guide on how to use slides.md to create and present markdown presentations
            </Dialog.Description>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">

              {/* Overview */}
              <section>
                <p className="leading-relaxed">
                  <span className="font-bold">✱ slides.md</span> turns markdown into presentations.
                  <br />
                  add optional frontmatter for metadata, separate slides with <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">===</code>, and you're done.
                </p>
              </section>

              {/* Multiple Presentations */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Multiple Presentations
                </h2>
                <p className="leading-relaxed">
                  create and manage multiple presentations from the home page. click "New Presentation" or press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">^N</kbd> to create a new deck.</p>
              </section>



              {/* Frontmatter */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Frontmatter (Optional)
                </h2>
                <p className="leading-relaxed">
                  add metadata at the beginning of your editor using the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">@@@</code> delimiter:
                </p>

                <div className="relative mt-3 p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs overflow-x-auto border border-gray-700 dark:border-gray-600 font-mono text-gray-100 dark:text-gray-200 whitespace-pre">
                  <Button
                    onClick={handleCopyFrontmatter}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-100 dark:hover:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-900"
                    aria-label="Copy frontmatter to clipboard"
                    type="button"
                  >
                    {frontmatterCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  {`@@@
title: Sample presentation
description: Add presentation description
date: ${format(new Date(), "yyyyMMdd")}
presenter: My team
@@@`}
                </div>

                <p className="leading-relaxed">
                  this adds a title slide to your presentation.
                </p>
              </section>

              {/* Slide Separation */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Slide Separation
                </h2>
                <p className="leading-relaxed">
                  use <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">===</code> delimiter in content to separate slides:
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
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 dark:text-gray-300">
                  <li>headings, lists, blockquotes</li>
                  <li>fenced code blocks with syntax highlighting</li>
                  <li>image-only slides fill the entire slide area</li>
                </ul>
              </section>

              {/* Presentation Mode */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Presenting
                </h2>
                <p className="leading-relaxed">
                  click "Present" to enter fullscreen. use arrow keys or on-screen controls to navigate.
                </p>
              </section>

              {/* Keyboard Shortcuts */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Keyboard Shortcuts
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      standard view
                    </h3>
                    <ul className="text-sm list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">⌘↵</kbd>
                        <span>present (fullscreen)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">^T</kbd>
                        <span>toggle dark mode</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      presentation view
                    </h3>
                    <ul className="text-sm list-disc list-inside space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">→</kbd>
                        <span>next slide</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">←</kbd>
                        <span>previous slide</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">T</kbd>
                        <span>toggle theme</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-mono font-medium">R</kbd>
                        <span>reset deck</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* LLM Prompt */}
              <section>
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  LLM Prompt
                </h2>
                <p className="leading-relaxed mb-3">
                  use this prompt to generate slides.md-compatible presentations:
                </p>

                <div className="relative bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-gray-700 dark:border-gray-600 text-sm font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap">
                  <Button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-100 dark:hover:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-900"
                    aria-label="Copy prompt to clipboard"
                    type="button"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  {llmPrompt}
                </div>
              </section>
            </div>

            <div className="mt-8 flex justify-between items-center pt-6">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Crafted with ♥ by{" "}
                <a
                  href="https://mrinmay.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline decoration-dotted transition-colors inline-flex items-center gap-1"
                >
                  Mrinmay
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </span>
              <Dialog.Close asChild>
                <Button
                  className="px-3 py-1 border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
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

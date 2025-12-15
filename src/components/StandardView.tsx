import { Editor } from "./Editor";
import { Slide } from "./Slide";
import { Director } from "./Director";

interface StandardViewProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  slides: string[];
  frontmatter?: Record<string, string>;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleFullscreen: () => void;
  onReset: () => void;
  onCopy: () => void;
  prevSlide: () => void;
  nextSlide: () => void;
}

export function StandardView({
  markdown,
  setMarkdown,
  currentSlide,
  setCurrentSlide,
  slides,
  frontmatter,
  isDark,
  setIsDark,
  toggleFullscreen,
  onReset,
  onCopy,
  prevSlide,
  nextSlide,
}: StandardViewProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b px-6 py-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            ✱ slides.md
            <span className="text-xs ml-2 opacity-70">
              (present your markdown)
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {isDark ? "Light (^T)" : "Dark (^T)"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Editor
          markdown={markdown}
          setMarkdown={setMarkdown}
          setCurrentSlide={setCurrentSlide}
          onReset={onReset}
          onCopy={onCopy}
          isDark={isDark}
        />
        {/* Preview */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-gray-900">
          <div className="px-4 py-2 border-b text-sm font-medium flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(0)}
                className="px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Reset Deck
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Present (⌘↵)
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center text-gray-900 dark:text-gray-100">
            <Slide
              slide={slides[currentSlide]}
              isTitle={slides[currentSlide] === "__TITLE_SLIDE__"}
              frontmatter={frontmatter}
            />
          </div>
          <Director
            currentSlide={currentSlide}
            slidesLength={slides.length}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            frontmatter={frontmatter}
            onToggleTheme={() => setIsDark((d) => !d)}
          />
        </div>
      </div>
    </div>
  );
}


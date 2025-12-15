import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { Editor } from "./Editor";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "./Button";
import { GettingStartedModal } from "./GettingStartedModal";

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
  const [viewMode, setViewMode] = useState<"editor" | "presentation">("editor");

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            ✱ slides.md
            <GettingStartedModal />
          </h1>

          <div className="flex flex-col items-end gap-2 min-[1200px]:flex-row min-[1200px]:items-center">
            <Button
              onClick={() => setIsDark(!isDark)}
              className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className="hidden sm:inline">{isDark ? "Light (^T)" : "Dark (^T)"}</span>
              <span className="sm:hidden">{isDark ? "Light" : "Dark"}</span>
            </Button>
            {/* Mobile switcher - only visible below 1200px, below theme toggle */}
            <div className="max-[1199px]:flex min-[1200px]:hidden items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-gray-400" htmlFor="view-switch">
                {viewMode === "editor" ? "Editor" : "Preview"}
              </label>
              <Switch.Root
                id="view-switch"
                checked={viewMode === "presentation"}
                onCheckedChange={(checked) => setViewMode(checked ? "presentation" : "editor")}
                className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500 outline-none cursor-pointer"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor - visible on desktop always (1200px+), on mobile only when viewMode is 'editor' */}
        <div className={`${viewMode === "editor" ? "flex" : "hidden"} min-[1200px]:flex min-[1200px]:flex-1 w-full`}>
          <Editor
            markdown={markdown}
            setMarkdown={setMarkdown}
            setCurrentSlide={setCurrentSlide}
            onReset={onReset}
            onCopy={onCopy}
            isDark={isDark}
          />
        </div>
        {/* Preview - visible on desktop always (1200px+), on mobile only when viewMode is 'presentation' */}
        <div className={`${viewMode === "presentation" ? "flex" : "hidden"} min-[1200px]:flex min-[1200px]:flex-1 w-full flex-col bg-white dark:bg-gray-900`}>
          <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentSlide(0)}
                className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Reset Deck
              </Button>
              <Button
                onClick={toggleFullscreen}
                className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="hidden sm:inline">Present (⌘↵)</span>
                <span className="sm:hidden">Present</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center text-gray-900 dark:text-gray-100">
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
            onToggleTheme={() => setIsDark(!isDark)}
          />
        </div>
      </div>
    </div>
  );
}


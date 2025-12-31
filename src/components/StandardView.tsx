import { Editor } from "./Editor";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "../ui/Button";
import { AppHeader } from "./AppHeader";
import { StandardViewNav } from "./StandardViewNav";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, RotateCcw } from "lucide-react";

interface StandardViewProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  slides: string[];
  frontmatter?: Record<string, string>;
  imageOnlySlides: Set<number>;
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleFullscreen: () => void;
  toggleEditorFullscreen: () => void;
  onClear: () => void;
  onCopy: () => void;
  prevSlide: () => void;
  nextSlide: () => void;
  presentationName?: string;
  onEditName?: () => void;
}

export function StandardView({
  markdown,
  setMarkdown,
  currentSlide,
  setCurrentSlide,
  slides,
  frontmatter,
  imageOnlySlides,
  isDark,
  setIsDark,
  toggleFullscreen,
  toggleEditorFullscreen,
  onClear,
  onCopy,
  prevSlide,
  nextSlide,
  presentationName,
  onEditName,
}: StandardViewProps) {
  const [isEditorExpandedRaw, setIsEditorExpanded] = useLocalStorage("isEditorExpanded", true);
  const isEditorExpanded = isEditorExpandedRaw ?? true;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      <AppHeader
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <StandardViewNav
        presentationName={presentationName}
        onEditName={onEditName}
        isEditorExpanded={isEditorExpanded}
        onToggleEditorExpand={() => setIsEditorExpanded(!isEditorExpanded)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor - visible on desktop always (1200px+), on mobile only when editor is expanded */}
        <div className={`${isEditorExpanded ? "flex" : "hidden"} min-[1200px]:flex ${isEditorExpanded ? "min-[1200px]:flex-1" : "min-[1200px]:w-0"} w-full`}>
          <Editor
            markdown={markdown}
            setMarkdown={setMarkdown}
            setCurrentSlide={setCurrentSlide}
            onClear={onClear}
            onCopy={onCopy}
            onToggleFullscreen={toggleEditorFullscreen}
            isDark={isDark}
            isExpanded={isEditorExpanded}
          />
        </div>
        {/* Preview - visible on desktop always (1200px+), on mobile only when editor is collapsed */}
        <div className={`${!isEditorExpanded ? "flex" : "hidden"} min-[1200px]:flex min-[1200px]:flex-1 w-full flex-col bg-white dark:bg-gray-900`}>
          <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleFullscreen}
                className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="hidden sm:inline">Present (⌘↵)</span>
                <span className="sm:hidden">Present</span>
              </Button>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
                    title="More Options"
                  >
                    <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[180px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-1 z-50"
                    sideOffset={5}
                    align="end"
                  >
                    <DropdownMenu.Item
                      className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2"
                      onSelect={() => setCurrentSlide(0)}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Deck</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
          <div className={`standard-view-slide flex-1 overflow-auto flex text-gray-900 dark:text-gray-100 ${
            slides[currentSlide] === "__TITLE_SLIDE__"
              ? "items-center justify-center p-4 sm:p-8 px-4 sm:px-8"
              : imageOnlySlides.has(currentSlide)
              ? "items-center justify-center p-0"
              : "pt-[25vh] pb-8 justify-center px-4 sm:px-8"
          }`}>
            <Slide
              slide={slides[currentSlide]}
              isTitle={slides[currentSlide] === "__TITLE_SLIDE__"}
              isImageOnly={imageOnlySlides.has(currentSlide)}
              frontmatter={frontmatter}
            />
          </div>
          <Director
            currentSlide={currentSlide}
            slidesLength={slides.length}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            setCurrentSlide={setCurrentSlide}
            frontmatter={frontmatter}
            onToggleTheme={() => setIsDark(!isDark)}
          />
        </div>
      </div>
    </div>
  );
}


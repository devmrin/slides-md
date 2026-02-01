import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/Button";

interface SlideNavProps {
  currentSlide: number;
  slidesLength: number;
  prevSlide: () => void;
  nextSlide: () => void;
  setCurrentSlide: (slide: number) => void;
  frontmatter?: Record<string, string>;
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
  onToggleTheme?: () => void;
  onFocusInputReady?: (focusFn: () => void) => void;
}

export function SlideNav({
  currentSlide,
  slidesLength,
  prevSlide,
  nextSlide,
  setCurrentSlide,
  frontmatter,
  isFullscreen,
  onFocusInputReady,
}: SlideNavProps) {
  const [inputValue, setInputValue] = useState(String(currentSlide + 1));
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input when currentSlide changes externally
  useEffect(() => {
    setInputValue(String(currentSlide + 1));
  }, [currentSlide]);

  // Expose focus function to parent when in fullscreen
  useEffect(() => {
    if (isFullscreen && onFocusInputReady) {
      onFocusInputReady(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isFullscreen, onFocusInputReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 1) {
      setCurrentSlide(0);
      setInputValue("1");
    } else if (num > slidesLength) {
      setCurrentSlide(slidesLength - 1);
      setInputValue(String(slidesLength));
    } else {
      setCurrentSlide(num - 1);
      setInputValue(String(num));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="border-t p-2 sm:p-4 flex items-center justify-between border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-[84px]">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm border rounded disabled:opacity-30 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation"
        >
          <span className="hidden sm:inline">← Previous</span>
          <span className="sm:hidden">←</span>
        </Button>
      </div>
      <div className="text-center flex-1 mx-2 sm:mx-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs sm:text-sm opacity-60 tabular-nums">Slide</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-10 sm:w-12 text-center text-xs sm:text-sm border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 tabular-nums"
            title={isFullscreen ? "Jump to slide (J)" : undefined}
          />
          <span className="text-xs sm:text-sm opacity-60 tabular-nums">of {slidesLength}</span>
          {isFullscreen && (
            <span className="text-xs opacity-70 hidden sm:inline ml-1">(J)</span>
          )}
        </div>
        {frontmatter?.title && frontmatter?.presenter && Number(currentSlide) > 0 && (
          <div className="text-xs mt-1 opacity-40 hidden sm:block">
            {frontmatter.title} by {frontmatter.presenter}
          </div>
        )}
      </div>
      <Button
        onClick={nextSlide}
        disabled={currentSlide === slidesLength - 1}
        className="px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm border rounded disabled:opacity-30 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation"
      >
        <span className="hidden sm:inline">Next →</span>
        <span className="sm:hidden">→</span>
      </Button>
    </div>
  );
}

import { Button } from "./Button";

interface SlideNavProps {
  currentSlide: number;
  slidesLength: number;
  prevSlide: () => void;
  nextSlide: () => void;
  frontmatter?: Record<string, string>;
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
  onToggleTheme?: () => void;
}

export function SlideNav({
  currentSlide,
  slidesLength,
  prevSlide,
  nextSlide,
  frontmatter,
}: SlideNavProps) {
  return (
    <div className="border-t p-2 sm:p-4 flex items-center justify-between border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
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
        <div className="text-xs sm:text-sm opacity-60 tabular-nums">
          Slide {currentSlide + 1} of {slidesLength}
        </div>
        {frontmatter?.description && (
          <div className="text-xs mt-1 opacity-40 min-h-[1rem] hidden sm:block">
            {frontmatter?.title && frontmatter?.presenter && Number(currentSlide) > 0 && (
              <>
                {frontmatter.title} by {frontmatter.presenter}
              </>
            )}
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

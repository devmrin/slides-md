import { Slide } from "./Slide";
import { Director } from "./Director";

interface PresentationViewProps {
  currentSlide: number;
  slides: string[];
  frontmatter?: Record<string, string>;
  prevSlide: () => void;
  nextSlide: () => void;
  setIsFullscreen: (value: boolean) => void;
  setIsDark: (updater: (prev: boolean) => boolean) => void;
  setCurrentSlide: (slide: number) => void;
}

export function PresentationView({
  currentSlide,
  slides,
  frontmatter,
  prevSlide,
  nextSlide,
  setIsFullscreen,
  setIsDark,
  setCurrentSlide,
}: PresentationViewProps) {
  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  
  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top bar for reset, theme, and exit */}
      <div className="w-full flex justify-between items-start px-6 pt-4 z-10">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setCurrentSlide(0)}
          >
            Reset <span className="ml-1 text-xs opacity-70">(R)</span>
          </button>
          <button
            className="px-3 py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsDark((d) => !d)}
          >
            Theme <span className="ml-1 text-xs opacity-70">(T)</span>
          </button>
        </div>
        <button
          className="px-3 py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsFullscreen(false)}
        >
          Exit <span className="ml-1 text-xs opacity-70">(ESC)</span>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
        <Slide
          slide={slides[currentSlide]}
          isTitle={isTitle}
          frontmatter={frontmatter}
        />
      </div>
      <Director
        currentSlide={currentSlide}
        slidesLength={slides.length}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        frontmatter={frontmatter}
        isFullscreen={true}
        onExitFullscreen={() => setIsFullscreen(false)}
        onToggleTheme={() => setIsDark((d) => !d)}
      />
    </div>
  );
}


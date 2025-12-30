import { useRef, useEffect } from "react";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "./Button";
import { useFullscreen } from "../hooks/useFullscreen";

interface PresentationViewProps {
  currentSlide: number;
  slides: string[];
  frontmatter?: Record<string, string>;
  prevSlide: () => void;
  nextSlide: () => void;
  setIsFullscreen: (value: boolean) => void;
  setIsDark: (updater: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentSlide: (slide: number) => void;
  isFullscreen: boolean;
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
  isFullscreen,
}: PresentationViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRequestedFullscreen = useRef(false);
  const { requestFullscreenOnly } = useFullscreen(containerRef, isFullscreen, setIsFullscreen);

  // Request fullscreen when component mounts with isFullscreen=true
  useEffect(() => {
    if (isFullscreen && containerRef.current && !hasRequestedFullscreen.current) {
      hasRequestedFullscreen.current = true;
      requestFullscreenOnly();
    }
  }, [isFullscreen, requestFullscreenOnly]);

  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      {/* Top bar for reset, theme, and exit */}
      <div className="w-full flex justify-between items-start px-4 pt-3 sm:px-6 sm:pt-4 z-10">
        <div className="flex gap-2">
          <Button
            className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            onClick={() => setCurrentSlide(0)}
          >
            Reset <span className="ml-1 text-xs opacity-70 hidden sm:inline">(R)</span>
          </Button>
          <Button
            className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            onClick={() => setIsDark((d) => !d)}
          >
            Theme <span className="ml-1 text-xs opacity-70 hidden sm:inline">(T)</span>
          </Button>
        </div>
        <Button
          className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
          onClick={() => setIsFullscreen(false)}
        >
          Exit <span className="ml-1 text-xs opacity-70 hidden sm:inline">(ESC)</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={`presentation-view-slide px-4 sm:px-12 flex ${
          isTitle
            ? "min-h-full items-center justify-center p-4 sm:p-12"
            : "pt-[25vh] pb-12 justify-center"
        }`}>
          <Slide
            slide={slides[currentSlide]}
            isTitle={isTitle}
            frontmatter={frontmatter}
          />
        </div>
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


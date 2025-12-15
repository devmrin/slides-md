import { Slide } from "./Slide";
import { Director } from "./Director";

interface PresentationViewProps {
  currentSlide: number;
  slides: string[];
  frontmatter?: Record<string, string>;
  bgColor: string;
  textColor: string;
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
  bgColor,
  textColor,
  prevSlide,
  nextSlide,
  setIsFullscreen,
  setIsDark,
  setCurrentSlide,
}: PresentationViewProps) {
  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top bar for reset, theme, and exit */}
      <div className="w-full flex justify-between items-start px-6 pt-4 z-10">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            style={{
              borderColor: textColor + "40",
              color: textColor,
              backgroundColor: bgColor,
            }}
            onClick={() => setCurrentSlide(0)}
          >
            Reset <span className="ml-1 text-xs opacity-70">(R)</span>
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            style={{
              borderColor: textColor + "40",
              color: textColor,
              backgroundColor: bgColor,
            }}
            onClick={() => setIsDark((d) => !d)}
          >
            Theme <span className="ml-1 text-xs opacity-70">(T)</span>
          </button>
        </div>
        <button
          className="px-3 py-1 text-sm border rounded"
          style={{
            borderColor: textColor + "40",
            color: textColor,
            backgroundColor: bgColor,
          }}
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
        textColor={textColor}
        bgColor={bgColor}
        frontmatter={frontmatter}
        isFullscreen={true}
        onExitFullscreen={() => setIsFullscreen(false)}
        onToggleTheme={() => setIsDark((d) => !d)}
      />
    </div>
  );
}


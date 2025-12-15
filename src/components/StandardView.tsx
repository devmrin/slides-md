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
  bgColor: string;
  textColor: string;
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
  bgColor,
  textColor,
  isDark,
  setIsDark,
  toggleFullscreen,
  onReset,
  onCopy,
  prevSlide,
  nextSlide,
}: StandardViewProps) {
  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: bgColor, borderColor: textColor + "20" }}
      >
        <div>
          <h1 className="text-xl font-semibold">
            ✱ slides.md
            <span className="text-xs ml-2 opacity-70">
              (present your markdown)
            </span>
          </h1>
        </div>

        <button
          onClick={() => setIsDark(!isDark)}
          className="px-3 py-1 text-sm border rounded"
          style={{
            borderColor: textColor + "40",
            color: textColor,
            backgroundColor: bgColor,
          }}
        >
          {isDark ? "Light (^T)" : "Dark (^T)"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Editor
          markdown={markdown}
          setMarkdown={setMarkdown}
          setCurrentSlide={setCurrentSlide}
          textColor={textColor}
          bgColor={bgColor}
          onReset={onReset}
          onCopy={onCopy}
        />
        {/* Preview */}
        <div
          className="w-1/2 flex flex-col"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="px-4 py-2 border-b text-sm font-medium flex items-center justify-between gap-2"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              borderColor: textColor + "20",
            }}
          >
            <span>Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(0)}
                className="px-3 py-1 text-xs border rounded"
                style={{ borderColor: textColor + "40", color: textColor }}
              >
                Reset Deck
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 text-xs border rounded"
                style={{ borderColor: textColor + "40", color: textColor }}
              >
                Present (⌘↵)
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-auto p-8 flex items-center justify-center"
            style={{ color: textColor }}
          >
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
            textColor={textColor}
            bgColor={bgColor}
            frontmatter={frontmatter}
            onToggleTheme={() => setIsDark((d) => !d)}
          />
        </div>
      </div>
    </div>
  );
}


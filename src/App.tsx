import { useState, useEffect, useCallback } from "react";
import initialMarkdown from "./data/compiler.md?raw";
import { useSlides } from "./hooks/useSlides";
import { useFullscreen } from "./hooks/useFullscreen";
import { Slide } from "./components/Slide";
import { Editor } from "./components/Editor";
import { SlideNav } from "./components/SlideNav";

export default function App() {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  const { frontmatter, slides } = useSlides(markdown);

  const bgColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#1a1a1a";

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  }, [currentSlide]);

  const { toggleFullscreen } = useFullscreen(isFullscreen, setIsFullscreen);

  // Arrow key navigation (global)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      // Command+Enter to start presentation (fullscreen)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        setIsFullscreen(true);
      }
      // R to reset deck in fullscreen
      if (isFullscreen && (e.key === "r" || e.key === "R")) {
        setCurrentSlide(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, slides.length, nextSlide, prevSlide, isFullscreen]);

  // Copy editor content
  const copyEditorContent = () => {
    navigator.clipboard.writeText(markdown).catch(() => {});
  };

  // ---------------------------------------------------------------------------
  // Fullscreen View
  // ---------------------------------------------------------------------------
  if (isFullscreen) {
    const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
    return (
      <div
        className="fixed inset-0 flex flex-col"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Top bar for reset and exit */}
        <div className="w-full flex justify-between items-start px-6 pt-4 z-10">
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
        <SlideNav
          currentSlide={currentSlide}
          slidesLength={slides.length}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
          textColor={textColor}
          bgColor={bgColor}
          frontmatter={frontmatter}
          isFullscreen={true}
          onExitFullscreen={() => setIsFullscreen(false)}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Standard View
  // ---------------------------------------------------------------------------
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
            slides.md
            <span className="text-xs ml-4 opacity-70">(⌘↵ to present)</span>
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
          {isDark ? "Light" : "Dark"}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Editor
          markdown={markdown}
          setMarkdown={setMarkdown}
          setCurrentSlide={setCurrentSlide}
          textColor={textColor}
          bgColor={bgColor}
          onReset={() => {
            setMarkdown(initialMarkdown);
            setCurrentSlide(0);
          }}
          onCopy={copyEditorContent}
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
                Fullscreen
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
          <SlideNav
            currentSlide={currentSlide}
            slidesLength={slides.length}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            textColor={textColor}
            bgColor={bgColor}
          />
        </div>
      </div>
    </div>
  );
}

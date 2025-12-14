import React, { useState, useEffect } from "react";
import { marked } from "marked";

// Parse frontmatter
function parseFrontmatter(text: string): {
  frontmatter: Record<string, string>;
  content: string;
} {
  const frontmatterRegex = /^===\/===([\s\S]*?)===\/===/;
  const match = text.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, content: text };

  const frontmatterText = match[1].trim();
  const content = text.replace(frontmatterRegex, "").trim();

  const frontmatter: Record<string, string> = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}

export default function App(): JSX.Element {
  const [markdown, setMarkdown] = useState<string>(
    `===/===
title: Example Title
date: 2025-01-01
presenter: Presenter
description: Example slideshow
===/===

# Slide 1
Hello world

===

# Slide 2
Content here`
  );

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  const { frontmatter, content } = parseFrontmatter(markdown);
  const contentSlides = content.split("===").map((s) => s.trim());

  const slides =
    Object.keys(frontmatter).length > 0
      ? ["__TITLE_SLIDE__", ...contentSlides]
      : contentSlides;

  const bgColor = isDark ? "#1a1a1a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#1a1a1a";

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, slides.length, isFullscreen]);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log("Fullscreen not supported:", err);
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && isFullscreen) setIsFullscreen(false);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [isFullscreen]);

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
        <div className="flex-1 flex items-center justify-center p-12 overflow-auto">
          {isTitle ? (
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl font-bold mb-4">{frontmatter.title}</h1>
              {frontmatter.description && (
                <p className="text-xl opacity-70 mt-6">
                  {frontmatter.description}
                </p>
              )}
            </div>
          ) : (
            <div
              className="max-w-4xl w-full overflow-y-auto overflow-x-hidden"
              style={{
                maxHeight: "100%",
                fontSize: "1.25rem",
                lineHeight: "1.875rem",
                wordBreak: "break-word",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: marked(slides[currentSlide]),
                }}
              />
            </div>
          )}
        </div>

        <div
          className="border-t p-4 flex items-center justify-between"
          style={{ borderColor: textColor + "20", backgroundColor: bgColor }}
        >
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 border rounded disabled:opacity-30"
            style={{ borderColor: textColor + "40", color: textColor }}
          >
            ← Previous
          </button>

          <div className="text-center flex-1 mx-4">
            <div className="text-sm opacity-60">
              Slide {currentSlide + 1} of {slides.length}
            </div>
            {frontmatter.title && (
              <div className="text-xs mt-1 opacity-40">
                {frontmatter.title} by {frontmatter.presenter}
              </div>
            )}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 border rounded disabled:opacity-30"
            style={{ borderColor: textColor + "40", color: textColor }}
          >
            Next →
          </button>
        </div>

        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 px-3 py-1 text-sm border rounded"
          style={{
            borderColor: textColor + "40",
            color: textColor,
            backgroundColor: bgColor,
          }}
        >
          Exit (ESC)
        </button>
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
          <h1 className="text-xl font-semibold">slides.md</h1>
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
        {/* Editor */}
        <div
          className="w-1/2 border-r flex flex-col"
          style={{ backgroundColor: bgColor, borderColor: textColor + "20" }}
        >
          <div
            className="px-4 py-2 border-b text-sm font-medium"
            style={{ borderColor: textColor + "20" }}
          >
            <div className="flex items-center justify-between">
              Editor
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMarkdown(`===/===
title: Example Title
date: 2025-01-01
presenter: Presenter
description: Example slideshow
===/===

# Slide 1
Hello world

===

# Slide 2
Content here`);
                    setCurrentSlide(0);
                  }}
                  className="px-3 py-1 text-xs border rounded"
                  style={{ borderColor: textColor + "40", color: textColor }}
                >
                  Reset Editor
                </button>

                {/* Copy Button */}
                <button
                  onClick={copyEditorContent}
                  className="px-2 py-[2px] text-xs border rounded"
                  style={{
                    borderColor: textColor + "40",
                    color: textColor,
                    backgroundColor: bgColor,
                  }}
                >
                  Copy Content
                </button>
              </div>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              setCurrentSlide(0);
            }}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
            style={{ backgroundColor: bgColor, color: textColor }}
          />
        </div>

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
                onClick={() => {
                  setCurrentSlide(0);
                }}
                className="px-3 py-1 text-xs border rounded"
                style={{ borderColor: textColor + "40", color: textColor }}
              >
                Reset Deck
              </button>
              {/* Fullscreen */}
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
            {slides[currentSlide] === "__TITLE_SLIDE__" ? (
              <div className="text-center max-w-2xl">
                <h1 className="text-5xl font-bold mb-3">{frontmatter.title}</h1>
                {frontmatter.description && (
                  <p className="text-lg opacity-70 mt-4">
                    {frontmatter.description}
                  </p>
                )}
              </div>
            ) : (
              <div
                className="max-w-2xl w-full overflow-y-auto overflow-x-hidden"
                style={{ maxHeight: "100%", wordBreak: "break-word" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(slides[currentSlide]),
                  }}
                />
              </div>
            )}
          </div>

          <div
            className="border-t p-4 flex items-center justify-between"
            style={{
              borderColor: textColor + "20",
              backgroundColor: bgColor,
            }}
          >
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="px-4 py-2 border rounded disabled:opacity-30"
              style={{ borderColor: textColor + "40", color: textColor }}
            >
              ← Previous
            </button>

            <span className="text-sm" style={{ opacity: 0.7 }}>
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 border rounded disabled:opacity-30"
              style={{ borderColor: textColor + "40", color: textColor }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

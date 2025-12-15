import { useState, useCallback, useEffect } from "react";
import initialMarkdown from "./data/compiler.md?raw";
import { useSlides } from "./hooks/useSlides";
import { useFullscreen } from "./hooks/useFullscreen";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { PresentationView } from "./components/PresentationView";
import { StandardView } from "./components/StandardView";

export default function App() {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDark, setIsDark] = useLocalStorage("theme", false);

  const { frontmatter, slides } = useSlides(markdown);

  // Apply dark class to root element for Tailwind dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  }, [currentSlide]);

  const { toggleFullscreen } = useFullscreen(isFullscreen, setIsFullscreen);

  useKeyboardNavigation({
    nextSlide,
    prevSlide,
    isFullscreen,
    setIsFullscreen,
    setIsDark,
    setCurrentSlide,
  });

  // Copy editor content
  const copyEditorContent = () => {
    navigator.clipboard.writeText(markdown).catch(() => {});
  };

  if (isFullscreen) {
    return (
      <PresentationView
        currentSlide={currentSlide}
        slides={slides}
        frontmatter={frontmatter}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        setIsFullscreen={setIsFullscreen}
        setIsDark={setIsDark}
        setCurrentSlide={setCurrentSlide}
      />
    );
  }

  return (
    <StandardView
      markdown={markdown}
      setMarkdown={setMarkdown}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      slides={slides}
      frontmatter={frontmatter}
      isDark={isDark}
      setIsDark={setIsDark}
      toggleFullscreen={toggleFullscreen}
      onReset={() => {
        setMarkdown(initialMarkdown);
        setCurrentSlide(0);
      }}
      onCopy={copyEditorContent}
      prevSlide={prevSlide}
      nextSlide={nextSlide}
    />
  );
}

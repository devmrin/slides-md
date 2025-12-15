import { useState, useCallback, useEffect, type Dispatch, type SetStateAction } from "react";
import initialMarkdown from "./data/compiler.md?raw";
import { useSlides } from "./hooks/useSlides";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { PresentationView } from "./components/PresentationView";
import { FullscreenEditor } from "./components/FullscreenEditor";
import { StandardView } from "./components/StandardView";

export default function App() {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState<boolean>(false);
  const [isDark, setIsDarkRaw] = useLocalStorage("theme", false);
  
  // Ensure isDark is always boolean (not undefined)
  const isDarkValue = isDark ?? false;
  
  // Create a type-safe wrapper for setIsDark that ensures boolean type
  const setIsDark: Dispatch<SetStateAction<boolean>> = useCallback((value) => {
    if (typeof value === "function") {
      setIsDarkRaw((prev) => {
        const prevValue = prev ?? false;
        const newValue = value(prevValue);
        return newValue;
      });
    } else {
      setIsDarkRaw(value);
    }
  }, [setIsDarkRaw]);

  const { frontmatter, slides } = useSlides(markdown);

  // Apply dark class to root element for Tailwind dark mode
  // This runs on mount and whenever isDark changes
  useEffect(() => {
    if (isDarkValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkValue]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  }, [currentSlide]);

  // Fullscreen hook is now used in PresentationView component

  useKeyboardNavigation({
    nextSlide,
    prevSlide,
    isFullscreen,
    setIsFullscreen,
    isEditorFullscreen,
    setIsEditorFullscreen,
    setIsDark,
    setCurrentSlide,
  });

  // Copy editor content
  const copyEditorContent = () => {
    navigator.clipboard.writeText(markdown).catch(() => {});
  };

  // Reset editor content
  const resetEditorContent = () => {
    setMarkdown(initialMarkdown);
    setCurrentSlide(0);
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
        isFullscreen={isFullscreen}
      />
    );
  }

  if (isEditorFullscreen) {
    return (
      <FullscreenEditor
        markdown={markdown}
        setMarkdown={setMarkdown}
        setCurrentSlide={setCurrentSlide}
        onReset={resetEditorContent}
        onCopy={copyEditorContent}
        setIsEditorFullscreen={setIsEditorFullscreen}
        isDark={isDarkValue}
        isEditorFullscreen={isEditorFullscreen}
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
      isDark={isDarkValue}
      setIsDark={setIsDark}
      toggleFullscreen={() => setIsFullscreen(true)}
      toggleEditorFullscreen={() => setIsEditorFullscreen(true)}
      onReset={resetEditorContent}
      onCopy={copyEditorContent}
      prevSlide={prevSlide}
      nextSlide={nextSlide}
    />
  );
}

import { useState, useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useSlides } from "./hooks/useSlides";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { PresentationView } from "./components/PresentationView";
import { FullscreenEditor } from "./components/FullscreenEditor";
import { StandardView } from "./components/StandardView";
import { db } from "./db";
import { IndexedDBAdapter } from "./db/indexeddbAdapter";

const DEFAULT_PRESENTATION_ID = "default";

export default function App() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const saveTimeoutRef = useRef<number | null>(null);
  const currentPresentationIdRef = useRef<string>(DEFAULT_PRESENTATION_ID);

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

  // Load presentation from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPresentation() {
      try {
        setIsLoading(true);
        const adapter = db as IndexedDBAdapter;
        // getPresentation will call initialize() which seeds initial data if needed
        const presentation = await adapter.getPresentation(DEFAULT_PRESENTATION_ID);
        
        if (isMounted && presentation) {
          setMarkdown(presentation.markdown);
          currentPresentationIdRef.current = presentation.id;
        }
      } catch (error) {
        console.error("Error loading presentation:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPresentation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save markdown to IndexedDB when it changes (debounced)
  useEffect(() => {
    // Don't save on initial load or if markdown is empty
    if (isLoading || !markdown) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current !== null) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce saves to avoid excessive writes
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await db.savePresentation({
          id: currentPresentationIdRef.current,
          name: frontmatter.title || "Untitled Presentation",
          markdown,
        });
      } catch (error) {
        console.error("Error saving presentation:", error);
      }
    }, 500); // 500ms debounce

    return () => {
      if (saveTimeoutRef.current !== null) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [markdown, frontmatter.title, isLoading]);

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

  // Clear editor content
  const clearEditorContent = async () => {
    setMarkdown("");
    setCurrentSlide(0);
    // Save empty markdown to database
    try {
      await db.savePresentation({
        id: currentPresentationIdRef.current,
        name: "Untitled Presentation",
        markdown: "",
      });
    } catch (error) {
      console.error("Error clearing presentation:", error);
    }
  };

  // Handle markdown updates with wrapper to ensure saves
  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

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
        setMarkdown={handleMarkdownChange}
        setCurrentSlide={setCurrentSlide}
        onClear={clearEditorContent}
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
      setMarkdown={handleMarkdownChange}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      slides={slides}
      frontmatter={frontmatter}
      isDark={isDarkValue}
      setIsDark={setIsDark}
      toggleFullscreen={() => setIsFullscreen(true)}
      toggleEditorFullscreen={() => setIsEditorFullscreen(true)}
      onClear={clearEditorContent}
      onCopy={copyEditorContent}
      prevSlide={prevSlide}
      nextSlide={nextSlide}
    />
  );
}

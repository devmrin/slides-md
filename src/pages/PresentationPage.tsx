import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useSlides } from "../hooks/useSlides";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { PresentationView } from "../components/PresentationView";
import { FullscreenEditor } from "../components/FullscreenEditor";
import { StandardView } from "../components/StandardView";
import { EditPresentationNameDialog } from "../components/EditPresentationNameDialog";
import { db } from "../db";

export function PresentationPage() {
  const { id } = useParams({ from: "/presentation/$id" });
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>("");
  const [presentationName, setPresentationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState<boolean>(false);
  const [isDark, setIsDarkRaw] = useLocalStorage("theme", false);
  const [focusSlideInput, setFocusSlideInput] = useState<
    (() => void) | undefined
  >(undefined);

  // Ensure isDark is always boolean (not undefined)
  const isDarkValue = isDark ?? false;

  // Create a type-safe wrapper for setIsDark that ensures boolean type
  const setIsDark: Dispatch<SetStateAction<boolean>> = useCallback(
    (value) => {
      if (typeof value === "function") {
        setIsDarkRaw((prev) => {
          const prevValue = prev ?? false;
          const newValue = value(prevValue);
          return newValue;
        });
      } else {
        setIsDarkRaw(value);
      }
    },
    [setIsDarkRaw]
  );

  const { frontmatter, slides, slideConfigs, imageOnlySlides } =
    useSlides(markdown);

  // Load presentation from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPresentation() {
      try {
        setIsLoading(true);
        const presentation = await db.getPresentation(id);

        if (isMounted) {
          if (presentation) {
            setMarkdown(presentation.markdown);
            setPresentationName(presentation.name);
          } else {
            // Presentation not found, redirect to home
            navigate({ to: "/" });
          }
        }
      } catch (error) {
        console.error("Error loading presentation:", error);
        if (isMounted) {
          navigate({ to: "/" });
        }
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
  }, [id, navigate]);

  // Save markdown to IndexedDB when it changes (debounced)
  useEffect(() => {
    // Don't save on initial load or if markdown is empty
    if (isLoading || !id) {
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
          id,
          name: presentationName,
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
  }, [markdown, presentationName, isLoading, id]);

  // Update document title with presentation name
  useEffect(() => {
    if (presentationName) {
      document.title = `${presentationName} - slides.md`;
    } else {
      document.title = "slides.md";
    }
  }, [presentationName]);

  // Apply dark class to root element for Tailwind dark mode
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

  useKeyboardNavigation({
    nextSlide,
    prevSlide,
    isFullscreen,
    setIsFullscreen,
    isEditorFullscreen,
    setIsEditorFullscreen,
    setIsDark,
    setCurrentSlide,
    focusSlideInput,
  });

  // Memoize the onFocusInputReady callback to prevent infinite loops
  const handleFocusInputReady = useCallback((focusFn: () => void) => {
    setFocusSlideInput(() => focusFn);
  }, []);

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
        id,
        name: presentationName,
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

  // Handle presentation name update
  const handleSaveName = async (newName: string) => {
    try {
      setPresentationName(newName);
      await db.savePresentation({
        id,
        name: newName,
        markdown,
      });
    } catch (error) {
      console.error("Error updating presentation name:", error);
      alert("Failed to update presentation name");
    }
  };

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
        slideConfigs={slideConfigs}
        frontmatter={frontmatter}
        imageOnlySlides={imageOnlySlides}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        setIsFullscreen={setIsFullscreen}
        setIsDark={setIsDark}
        setCurrentSlide={setCurrentSlide}
        isFullscreen={isFullscreen}
        onFocusInputReady={handleFocusInputReady}
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
    <>
      <StandardView
        markdown={markdown}
        setMarkdown={handleMarkdownChange}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        slides={slides}
        slideConfigs={slideConfigs}
        frontmatter={frontmatter}
        imageOnlySlides={imageOnlySlides}
        isDark={isDarkValue}
        setIsDark={setIsDark}
        toggleFullscreen={() => setIsFullscreen(true)}
        toggleEditorFullscreen={() => setIsEditorFullscreen(true)}
        onClear={clearEditorContent}
        onCopy={copyEditorContent}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        presentationName={presentationName}
        onEditName={() => setEditNameDialogOpen(true)}
      />
      <EditPresentationNameDialog
        open={editNameDialogOpen}
        onOpenChange={setEditNameDialogOpen}
        currentName={presentationName}
        onSave={handleSaveName}
      />
    </>
  );
}

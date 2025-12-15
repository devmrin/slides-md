import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  nextSlide: () => void;
  prevSlide: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
  isEditorFullscreen: boolean;
  setIsEditorFullscreen: (value: boolean) => void;
  setIsDark: (updater: (prev: boolean) => boolean) => void;
  setCurrentSlide: (slide: number) => void;
}

export function useKeyboardNavigation({
  nextSlide,
  prevSlide,
  isFullscreen,
  setIsFullscreen,
  isEditorFullscreen,
  setIsEditorFullscreen,
  setIsDark,
  setCurrentSlide,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't handle arrow keys if user is typing in an input/textarea/editor
      const activeElement = document.activeElement;
      const isEditing =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.hasAttribute("contenteditable") ||
          activeElement.closest(".cm-editor") !== null);

      if (isEditing && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        return; // Let the editor handle these keys
      }

      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      // Command+Enter to start presentation (fullscreen)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        setIsFullscreen(true);
      }
      // Command+T to toggle theme (prevent browser default)
      if ((e.metaKey || e.ctrlKey) && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        setIsDark((d) => !d);
      }
      // ESC to exit fullscreen modes
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        }
        if (isEditorFullscreen) {
          setIsEditorFullscreen(false);
        }
      }
      // R to reset deck in fullscreen
      if (isFullscreen && (e.key === "r" || e.key === "R")) {
        setCurrentSlide(0);
      }
      // T to toggle theme in fullscreen
      if (isFullscreen && (e.key === "t" || e.key === "T")) {
        setIsDark((d) => !d);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextSlide, prevSlide, isFullscreen, setIsFullscreen, isEditorFullscreen, setIsEditorFullscreen, setIsDark, setCurrentSlide]);
}


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
  focusSlideInput?: () => void;
  toggleControls?: () => void;
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
  focusSlideInput,
  toggleControls,
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
      // ESC to exit fullscreen modes
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        }
        if (isEditorFullscreen) {
          setIsEditorFullscreen(false);
        }
      }
      // H to toggle controls in fullscreen
      if (isFullscreen && (e.key === "c" || e.key === "C") && toggleControls) {
        toggleControls();
      }
      // T to toggle theme in fullscreen
      if (isFullscreen && (e.key === "t" || e.key === "T")) {
        setIsDark((d) => !d);
      }
      // J to focus slide input in fullscreen
      if (isFullscreen && (e.key === "j" || e.key === "J") && focusSlideInput) {
        // Don't focus if user is already typing in an input
        if (!isEditing) {
          e.preventDefault();
          focusSlideInput();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nextSlide, prevSlide, isFullscreen, setIsFullscreen, isEditorFullscreen, setIsEditorFullscreen, setIsDark, setCurrentSlide, focusSlideInput, toggleControls]);
}


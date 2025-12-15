import { useCallback, useEffect } from "react";

export function useFullscreen(isFullscreen: boolean, setIsFullscreen: (v: boolean) => void) {
  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, setIsFullscreen]);

  // Fullscreen change handler
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [isFullscreen, setIsFullscreen]);

  // Toggle function
  const toggleFullscreen = useCallback(async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen not supported:", err);
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement) await document.exitFullscreen();
    }
  }, [isFullscreen, setIsFullscreen]);

  return { toggleFullscreen };
}

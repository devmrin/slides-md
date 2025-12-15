import { useCallback, useEffect, RefObject } from "react";

// Helper functions for vendor-prefixed fullscreen API
const getFullscreenElement = () => {
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

const requestFullscreen = (element: HTMLElement) => {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    return (element as any).webkitRequestFullscreen();
  } else if ((element as any).mozRequestFullScreen) {
    return (element as any).mozRequestFullScreen();
  } else if ((element as any).msRequestFullscreen) {
    return (element as any).msRequestFullscreen();
  }
  return Promise.reject(new Error("Fullscreen API not supported"));
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    return (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    return (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    return (document as any).msExitFullscreen();
  }
  return Promise.reject(new Error("Fullscreen API not supported"));
};

export function useFullscreen(
  elementRef: RefObject<HTMLElement>,
  isFullscreen: boolean,
  setIsFullscreen: (v: boolean) => void
) {
  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        if (getFullscreenElement()) {
          exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, setIsFullscreen]);

  // Fullscreen change handler (with vendor prefixes)
  useEffect(() => {
    const handler = () => {
      if (!getFullscreenElement() && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("mozfullscreenchange", handler);
    document.addEventListener("MSFullscreenChange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("mozfullscreenchange", handler);
      document.removeEventListener("MSFullscreenChange", handler);
    };
  }, [isFullscreen, setIsFullscreen]);

  // Request fullscreen only (doesn't toggle state)
  const requestFullscreenOnly = useCallback(async () => {
    if (!elementRef.current) return;
    if (getFullscreenElement()) return; // Already in fullscreen

    try {
      await requestFullscreen(elementRef.current);
    } catch (err) {
      console.error("Fullscreen not supported:", err);
    }
  }, [elementRef]);

  // Toggle function
  const toggleFullscreen = useCallback(async () => {
    if (!elementRef.current) return;

    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        await requestFullscreen(elementRef.current);
      } catch (err) {
        console.error("Fullscreen not supported:", err);
        setIsFullscreen(false);
      }
    } else {
      setIsFullscreen(false);
      if (getFullscreenElement()) {
        try {
          await exitFullscreen();
        } catch (err) {
          console.error("Exit fullscreen failed:", err);
        }
      }
    }
  }, [elementRef, isFullscreen, setIsFullscreen]);

  return { toggleFullscreen, requestFullscreenOnly };
}

import { useCallback, useEffect, type RefObject } from "react";

// Type definitions for vendor-prefixed fullscreen APIs
interface DocumentWithVendorPrefixes extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface HTMLElementWithVendorPrefixes extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

// Helper functions for vendor-prefixed fullscreen API
const getFullscreenElement = () => {
  const doc = document as DocumentWithVendorPrefixes;
  return (
    document.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
};

const requestFullscreen = (element: HTMLElement) => {
  const el = element as HTMLElementWithVendorPrefixes;
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    return el.webkitRequestFullscreen();
  } else if (el.mozRequestFullScreen) {
    return el.mozRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    return el.msRequestFullscreen();
  }
  return Promise.reject(new Error("Fullscreen API not supported"));
};

const exitFullscreen = () => {
  const doc = document as DocumentWithVendorPrefixes;
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    return doc.mozCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }
  return Promise.reject(new Error("Fullscreen API not supported"));
};

export function useFullscreen(
  elementRef: RefObject<HTMLElement | null>,
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

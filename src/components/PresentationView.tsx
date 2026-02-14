import { useRef, useEffect, useState } from "react";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "../ui/Button";
import { LaserPointerOverlay } from "./LaserPointerOverlay";
import { useFullscreen } from "../hooks/useFullscreen";
import { type SlideConfig } from "../hooks/useSlides";
import { SlideFrame } from "./SlideFrame";
import { db } from "../db";
import { getImageUrlsFromMarkdown } from "../utils/getImageUrlsFromMarkdown";

interface PresentationViewProps {
  currentSlide: number;
  slides: string[];
  slideConfigs: SlideConfig[];
  frontmatter?: Record<string, string>;
  imageOnlySlides: Set<number>;
  prevSlide: () => void;
  nextSlide: () => void;
  setIsFullscreen: (value: boolean) => void;
  setIsDark: (updater: boolean | ((prev: boolean) => boolean)) => void;
  setCurrentSlide: (slide: number) => void;
  isFullscreen: boolean;
  onFocusInputReady?: (focusFn: () => void) => void;
  controlsHidden: boolean;
  toggleControls: () => void;
  laserPointerActive: boolean;
  onToggleLaserPointer: () => void;
  isDesktop: boolean;
}

export function PresentationView({
  currentSlide,
  slides,
  slideConfigs,
  frontmatter,
  imageOnlySlides,
  prevSlide,
  nextSlide,
  setIsFullscreen,
  setIsDark,
  setCurrentSlide,
  isFullscreen,
  onFocusInputReady,
  controlsHidden,
  toggleControls,
  laserPointerActive,
  onToggleLaserPointer,
  isDesktop,
}: PresentationViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRequestedFullscreen = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    touchStartRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 0 || !touchStartRef.current) return;
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - start.x;
    const deltaY = endY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return; // vertical scroll, don't change slide
    if (deltaX < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };
  const { requestFullscreenOnly } = useFullscreen(
    containerRef,
    isFullscreen,
    setIsFullscreen,
  );

  // Request fullscreen when component mounts with isFullscreen=true
  useEffect(() => {
    if (
      isFullscreen &&
      containerRef.current &&
      !hasRequestedFullscreen.current
    ) {
      hasRequestedFullscreen.current = true;
      requestFullscreenOnly();
    }
  }, [isFullscreen, requestFullscreenOnly]);

  // Resolve media:// URL for logo if present
  useEffect(() => {
    const resolveLogo = async () => {
      const logo = frontmatter?.logo;
      if (!logo) {
        setResolvedLogoUrl(null);
        return;
      }

      // Check if it's a media:// URL
      const mediaMatch = logo.match(/^media:\/\/([a-f0-9-]+)$/);
      if (mediaMatch) {
        const mediaId = mediaMatch[1];
        try {
          const mediaItem = await db.getMedia(mediaId);
          if (mediaItem) {
            setResolvedLogoUrl(mediaItem.dataUrl);
            return;
          }
        } catch (error) {
          console.error(`Failed to resolve logo media://${mediaId}:`, error);
        }
        setResolvedLogoUrl(null);
      } else {
        // Not a media:// URL, use as-is (regular URL)
        setResolvedLogoUrl(logo);
      }
    };

    resolveLogo();
  }, [frontmatter?.logo]);

  // Preload all non-media image URLs from every slide so they're cached before navigation.
  // media:// URLs are resolved from IndexedDB per-slide and are not preloaded here.
  useEffect(() => {
    const urls = new Set<string>();
    for (const slide of slides) {
      if (slide === "__TITLE_SLIDE__") continue;
      for (const url of getImageUrlsFromMarkdown(slide)) {
        urls.add(url);
      }
    }
    const logo = frontmatter?.logo;
    if (logo && !logo.startsWith("media://")) {
      urls.add(logo);
    }
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [slides, frontmatter?.logo]);

  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  const isImageOnly = imageOnlySlides.has(currentSlide);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top-right buttons (fixed) */}
      <div className="fixed top-3 right-4 sm:top-4 sm:right-6 z-20 flex gap-2">
        {!controlsHidden && (
          <>
            <Button
              className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
              onClick={() => setIsDark((d) => !d)}
            >
              Theme{" "}
              <span className="ml-1 text-xs opacity-70 hidden sm:inline">
                (T)
              </span>
            </Button>
            {isDesktop && (
              <Button
                className={`px-3 py-1.5 sm:py-1 text-sm border rounded touch-manipulation ${
                  laserPointerActive
                    ? "border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={onToggleLaserPointer}
              >
                Laser{" "}
                <span className="ml-1 text-xs opacity-70 hidden sm:inline">
                  (L)
                </span>
              </Button>
            )}
          </>
        )}
        <Button
          className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
          onClick={toggleControls}
        >
          Controls{" "}
          <span className="ml-1 text-xs opacity-70 hidden sm:inline">(C)</span>
        </Button>
      </div>

      {/* Laser pointer overlay (desktop only, when active) */}
      {isDesktop && <LaserPointerOverlay active={laserPointerActive} />}

      {/* Top bar for exit - only shown when controls visible */}
      {!controlsHidden && (
        <div className="w-full flex justify-start items-start px-4 pt-3 sm:px-6 sm:pt-4 z-10">
          <Button
            className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            onClick={() => setIsFullscreen(false)}
          >
            Exit{" "}
            <span className="ml-1 text-xs opacity-70 hidden sm:inline">
              (ESC)
            </span>
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <SlideFrame
          variant="presentation"
          isTitle={isTitle}
          isImageOnly={isImageOnly}
          align={slideConfigs[currentSlide]?.align}
          canvasPosition="top-center"
          frameClassName="bg-white dark:bg-gray-900"
          overlay={
            resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt="Logo"
                className={`presentation-logo absolute bottom-16 z-10 shadow-none ${
                  frontmatter?.logoPosition === "right" ? "right-16" : "left-16"
                } ${
                  frontmatter?.logoSize === "sm"
                    ? "h-8"
                    : frontmatter?.logoSize === "lg"
                      ? "h-12"
                      : "h-10"
                } w-auto`}
                style={{
                  opacity: frontmatter?.logoOpacity
                    ? parseFloat(frontmatter.logoOpacity)
                    : 0.9,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null
          }
        >
          <Slide
            key={currentSlide}
            slide={slides[currentSlide]}
            isTitle={isTitle}
            isImageOnly={isImageOnly}
            frontmatter={frontmatter}
            config={slideConfigs[currentSlide]}
          />
        </SlideFrame>
      </div>
      {!controlsHidden && (
        <Director
          currentSlide={currentSlide}
          slidesLength={slides.length}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
          setCurrentSlide={setCurrentSlide}
          frontmatter={frontmatter}
          isFullscreen={true}
          onExitFullscreen={() => setIsFullscreen(false)}
          onToggleTheme={() => setIsDark((d) => !d)}
          onFocusInputReady={onFocusInputReady}
        />
      )}
    </div>
  );
}

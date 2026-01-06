import { useRef, useEffect, useState } from "react";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "../ui/Button";
import { useFullscreen } from "../hooks/useFullscreen";
import { type SlideConfig } from "../hooks/useSlides";
import { db } from "../db";

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
}: PresentationViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRequestedFullscreen = useRef(false);
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);
  const { requestFullscreenOnly } = useFullscreen(
    containerRef,
    isFullscreen,
    setIsFullscreen
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

  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  const isImageOnly = imageOnlySlides.has(currentSlide);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      {/* Top bar for exit, reset, and theme */}
      <div className="w-full flex justify-between items-start px-4 pt-3 sm:px-6 sm:pt-4 z-10">
        <Button
          className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
          onClick={() => setIsFullscreen(false)}
        >
          Exit{" "}
          <span className="ml-1 text-xs opacity-70 hidden sm:inline">
            (ESC)
          </span>
        </Button>
        <div className="flex gap-2">
          <Button
            className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            onClick={() => setCurrentSlide(0)}
          >
            Reset{" "}
            <span className="ml-1 text-xs opacity-70 hidden sm:inline">
              (R)
            </span>
          </Button>
          <Button
            className="px-3 py-1.5 sm:py-1 text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
            onClick={() => setIsDark((d) => !d)}
          >
            Theme{" "}
            <span className="ml-1 text-xs opacity-70 hidden sm:inline">
              (T)
            </span>
          </Button>
        </div>
      </div>
      {isImageOnly ? (
        <div
          className={`presentation-view-slide flex-1 overflow-hidden flex items-center justify-center p-0`}
        >
          <Slide
            key={currentSlide}
            slide={slides[currentSlide]}
            isTitle={isTitle}
            isImageOnly={isImageOnly}
            frontmatter={frontmatter}
            config={slideConfigs[currentSlide]}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div
            className={`presentation-view-slide flex ${
              isTitle
                ? "min-h-full items-center justify-center p-4 sm:p-12 px-4 sm:px-12"
                : (() => {
                    const config = slideConfigs[currentSlide] || {};
                    const align = config.align || "center";
                    let classes = "justify-center px-4 sm:px-12 ";
                    if (align === "top") {
                      classes += "pt-8 pb-12";
                    } else if (align === "center") {
                      classes += "pt-[25vh] pb-12";
                    } else if (align === "bottom") {
                      classes += "pb-12 items-end";
                    }
                    return classes;
                  })()
            }`}
          >
            <Slide
              key={currentSlide}
              slide={slides[currentSlide]}
              isTitle={isTitle}
              isImageOnly={isImageOnly}
              frontmatter={frontmatter}
              config={slideConfigs[currentSlide]}
            />
          </div>
        </div>
      )}
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
      {/* Logo positioned relative to SlideNav container */}
      {resolvedLogoUrl && (
        <img
          src={resolvedLogoUrl}
          alt="Logo"
          className={`presentation-logo absolute bottom-[94px] z-10 shadow-none ${
            frontmatter?.logoPosition === "right" ? "right-4" : "left-4"
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
      )}
    </div>
  );
}

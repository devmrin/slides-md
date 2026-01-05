import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "../db/adapter";

interface ImageCarouselProps {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageCarousel({
  media,
  initialIndex,
  onClose,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentMedia = media[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  }, [media.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  }, [media.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  // Prevent body scroll when carousel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation z-10"
        aria-label="Close carousel"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Previous button */}
      {media.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Next button */}
      {media.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={currentMedia.dataUrl}
          alt={currentMedia.filename}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>

      {/* Image info */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
        <div className="font-medium">{currentMedia.filename}</div>
        {media.length > 1 && (
          <div className="text-xs text-gray-300 mt-1">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>
    </div>
  );
}

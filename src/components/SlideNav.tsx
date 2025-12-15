interface SlideNavProps {
  currentSlide: number;
  slidesLength: number;
  prevSlide: () => void;
  nextSlide: () => void;
  textColor: string;
  bgColor: string;
  frontmatter?: Record<string, string>;
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
  onToggleTheme?: () => void;
}

export function SlideNav({
  currentSlide,
  slidesLength,
  prevSlide,
  nextSlide,
  textColor,
  bgColor,
  frontmatter,
}: SlideNavProps) {
  return (
    <div
      className="border-t p-4 flex items-center justify-between"
      style={{ borderColor: textColor + "20", backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 border rounded disabled:opacity-30"
          style={{ borderColor: textColor + "40", color: textColor }}
        >
          ← Previous
        </button>
      </div>
      <div className="text-center flex-1 mx-4">
        <div className="text-sm opacity-60">
          Slide {currentSlide + 1} of {slidesLength}
        </div>
        {frontmatter?.title && Number(currentSlide) > 0 && (
          <div className="text-xs mt-1 opacity-40">
            {frontmatter.title} by {frontmatter.presenter}
          </div>
        )}
      </div>
      <button
        onClick={nextSlide}
        disabled={currentSlide === slidesLength - 1}
        className="px-4 py-2 border rounded disabled:opacity-30"
        style={{ borderColor: textColor + "40", color: textColor }}
      >
        Next →
      </button>
    </div>
  );
}

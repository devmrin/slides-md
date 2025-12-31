import { SlideNav } from "./SlideNav";

interface DirectorProps {
  currentSlide: number;
  slidesLength: number;
  prevSlide: () => void;
  nextSlide: () => void;
  setCurrentSlide: (slide: number) => void;
  frontmatter?: Record<string, string>;
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
  onToggleTheme?: () => void;
  onFocusInputReady?: (focusFn: () => void) => void;
}

export function Director(props: DirectorProps) {
  // Central wrapper for slide navigation and controls.
  // Keeps navigation usage consistent across preview and fullscreen.
  return <SlideNav {...props} />;
}

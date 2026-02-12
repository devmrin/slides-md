import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

interface SlideFrameProps {
  variant: "standard" | "presentation";
  isTitle?: boolean;
  isImageOnly?: boolean;
  align?: "top" | "center" | "bottom";
  canvasPosition?: "top-left" | "top-center" | "center";
  frameClassName?: string;
  overlay?: ReactNode;
  children: ReactNode;
}

export function SlideFrame({
  variant,
  isTitle,
  isImageOnly,
  align = "center",
  canvasPosition = "top-left",
  frameClassName,
  overlay,
  children,
}: SlideFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!frameRef.current) return;

    const updateScale = () => {
      if (!frameRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      const nextScale = Math.min(
        rect.width / BASE_WIDTH,
        rect.height / BASE_HEIGHT,
      );
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frameRef.current);

    return () => observer.disconnect();
  }, []);

  const layoutClass = isTitle
    ? "items-center justify-center p-16"
    : isImageOnly
      ? "items-center justify-center p-0"
      : align === "top"
        ? "items-center justify-start pt-16 pb-16 px-16"
        : align === "bottom"
          ? "items-center justify-end pb-16 px-16"
          : "items-center justify-start pt-[180px] pb-16 px-16";

  const variantClass =
    variant === "standard" ? "standard-view-slide" : "presentation-view-slide";

  const canvasStyle =
    canvasPosition === "center"
      ? {
          top: "50%",
          left: "50%",
          transform: `scale(${scale}) translate(-50%, -50%)`,
        }
      : canvasPosition === "top-center"
        ? {
            left: "50%",
            transform: `scale(${scale}) translateX(-50%)`,
          }
        : {
            transform: `scale(${scale})`,
          };

  return (
    <div className="slide-frame">
      <div
        ref={frameRef}
        className={`slide-frame-inner ${frameClassName || ""}`}
      >
        <div className="slide-canvas" style={canvasStyle}>
          <div className={`slide-content ${variantClass} ${layoutClass}`}>
            {children}
          </div>
          {overlay && <div className="slide-canvas-overlay">{overlay}</div>}
        </div>
      </div>
    </div>
  );
}

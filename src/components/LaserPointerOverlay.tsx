import { useRef, useEffect } from "react";

const TRAIL_MS = 600;
const THROTTLE_MS = 16;
const STROKE_WIDTH = 4;
const DOT_RADIUS = 5;
const LASER_RED = "#e53935";

interface Point {
  x: number;
  y: number;
  t: number;
}

interface LaserPointerOverlayProps {
  active: boolean;
}

// Match PresentationView: top bar ~56px, bottom Director/SlideNav 84px
const TOP_BAR_INSET = "3.5rem";
const BOTTOM_BAR_INSET = "5.25rem";

export function LaserPointerOverlay({ active }: LaserPointerOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const lastMoveRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Capture mouse moves only over the content area (not top/bottom bars)
  useEffect(() => {
    if (!active) return;

    const capture = captureRef.current;
    if (!capture) return;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveRef.current < THROTTLE_MS) return;
      lastMoveRef.current = now;
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      const cutoff = now - TRAIL_MS - 100;
      if (pointsRef.current.length > 200) {
        pointsRef.current = pointsRef.current.filter((p) => p.t > cutoff);
      }
    };

    capture.addEventListener("mousemove", onMove, { passive: true });
    return () => capture.removeEventListener("mousemove", onMove);
  }, [active]);

  // Resize canvas to overlay and set high-DPI transform
  useEffect(() => {
    if (!active) return;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;

    const setSize = () => {
      const dpr = window.devicePixelRatio ?? 1;
      const w = overlay.clientWidth;
      const h = overlay.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, [active]);

  // Animation loop: prune old points and draw trail + dot
  useEffect(() => {
    if (!active) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pointsRef.current = [];
      return;
    }

    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;

    const draw = () => {
      const now = Date.now();
      const cutoff = now - TRAIL_MS;
      pointsRef.current = pointsRef.current.filter((p) => p.t > cutoff);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const w = overlay.clientWidth;
      const h = overlay.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const points = pointsRef.current;
      if (points.length < 2) {
        if (points.length === 1) {
          const p = points[0];
          const age = now - p.t;
          const opacity = Math.max(0, 1 - age / TRAIL_MS);
          ctx.fillStyle = LASER_RED;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = STROKE_WIDTH;

      // One continuous path with gradient opacity (oldest → transparent, newest → solid) so no dots at joints
      const p0 = points[0];
      const pLast = points[points.length - 1];
      const gradient = ctx.createLinearGradient(p0.x, p0.y, pLast.x, pLast.y);
      gradient.addColorStop(0, "rgba(229, 57, 53, 0)");
      gradient.addColorStop(1, "rgba(229, 57, 53, 1)");
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      const last = points[points.length - 1];
      ctx.fillStyle = LASER_RED;
      ctx.beginPath();
      ctx.arc(last.x, last.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: "block" }}
      />
      {/* Only this area captures mouse (laser trail); top/bottom bars stay clickable */}
      <div
        ref={captureRef}
        className="absolute left-0 right-0 cursor-none pointer-events-auto"
        style={{
          top: TOP_BAR_INSET,
          bottom: BOTTOM_BAR_INSET,
          touchAction: "none",
        }}
      />
    </div>
  );
}

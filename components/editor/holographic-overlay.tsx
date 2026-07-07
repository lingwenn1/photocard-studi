"use client";

import { useEffect, useRef } from "react";

/**
 * Настоящий iridescent-эффект на Canvas 2D.
 * Радиальный/угловой цветной градиент смещается вслед за курсором —
 * имитирует голографическую/переливающуюся плёнку картхолдера.
 */
export function HolographicOverlay({ kind }: { kind: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const parent = canvas.parentElement?.parentElement; // container over the stage
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      pointer.current.targetX = (e.clientX - rect.left) / rect.width;
      pointer.current.targetY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMove);

    const colorStops: Record<string, string[]> = {
      holographic: ["#ff9cc2", "#ffe29e", "#a8ffe0", "#b3d9ff", "#d9b3ff"],
      iridescent: ["#ff9cc2", "#b5eaff", "#d9ffe0", "#ffe9a8"],
      rainbow: ["#ff6b6b", "#ffd93d", "#6bffb3", "#6bd4ff", "#b98bff"],
      glitter: ["#ffffff", "#ffe9f5", "#ffffff"],
    };
    const colors = colorStops[kind] ?? colorStops.holographic;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // easing к целевой позиции курсора
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.08;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.08;
      tRef.current += 0.006;

      const cx = pointer.current.x * w;
      const cy = pointer.current.y * h;
      const angle = tRef.current * 2 + pointer.current.x * Math.PI;

      const grad = ctx.createLinearGradient(
        cx - Math.cos(angle) * w,
        cy - Math.sin(angle) * h,
        cx + Math.cos(angle) * w,
        cy + Math.sin(angle) * h
      );
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));

      ctx.globalAlpha = 0.55;
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (kind === "glitter") {
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 60; i++) {
          const gx = (Math.sin(i * 12.9898 + tRef.current) * 0.5 + 0.5) * w;
          const gy = (Math.sin(i * 78.233 + tRef.current * 1.3) * 0.5 + 0.5) * h;
          const dist = Math.hypot(gx - cx, gy - cy) / w;
          const twinkle = Math.max(0, 1 - dist) * (0.5 + 0.5 * Math.sin(tRef.current * 8 + i));
          ctx.globalAlpha = Math.max(0, twinkle);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(gx, gy, 1.6 * window.devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [kind]);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full mix-blend-screen" />
    </div>
  );
}

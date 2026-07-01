"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.offsetWidth;
    const H = cv.offsetHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Soft warm blobs
    const blobs = [
      { x: W * 0.15, y: H * 0.2,  r: W * 0.55, vx: 0.12, vy: 0.08 },
      { x: W * 0.85, y: H * 0.35, r: W * 0.5,  vx: -0.09, vy: 0.13 },
      { x: W * 0.5,  y: H * 0.85, r: W * 0.6,  vx: 0.07,  vy: -0.10 },
    ];

    let offset = 0;
    let rafId: number;

    function draw() {
      offset += 0.055;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Blobs
      blobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, "rgba(210,158,60,0.04)");
        g.addColorStop(1, "rgba(210,158,60,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      // Diagonal stripes
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate((-38 * Math.PI) / 180);

      const diag = Math.sqrt(W * W + H * H) * 1.1;
      const spacing = 72;
      const count = Math.ceil(diag / spacing) + 2;
      const shift = offset % spacing;

      for (let i = -count; i <= count; i++) {
        const x = i * spacing + shift;

        ctx.fillStyle = "rgba(180,130,40,0.032)";
        ctx.fillRect(x - 1, -diag, 2, diag * 2);

        const glow = ctx.createLinearGradient(x - 18, 0, x + 18, 0);
        glow.addColorStop(0, "rgba(210,158,60,0)");
        glow.addColorStop(0.5, "rgba(210,158,60,0.014)");
        glow.addColorStop(1, "rgba(210,158,60,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - 18, -diag, 36, diag * 2);
      }

      ctx.restore();

      // Centre soft vignette for legibility
      const spot = ctx.createRadialGradient(
        W / 2, H * 0.42, 0,
        W / 2, H * 0.42, H * 0.45
      );
      spot.addColorStop(0, "rgba(255,255,255,0.5)");
      spot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

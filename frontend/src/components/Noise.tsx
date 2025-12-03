'use client';

import React, { useRef, useEffect } from "react";

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number; 
  fullScreen?: boolean; 
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 256,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 16,
  fullScreen = true,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // respect reduced motion preference
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      canvas.style.opacity = "0.02";
      return;
    }

    let tileCanvas: HTMLCanvasElement | null = null;
    let tileCtx: CanvasRenderingContext2D | null = null;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const makeTile = () => {
      // create small tile and fill one frame of noise (patternSize x patternSize)
      tileCanvas = document.createElement("canvas");
      tileCanvas.width = Math.round(patternSize * dpr);
      tileCanvas.height = Math.round(patternSize * dpr);
      tileCtx = tileCanvas.getContext("2d", { alpha: true });
      if (!tileCtx) return;

      const tileImage = tileCtx.createImageData(tileCanvas.width, tileCanvas.height);
      const data = tileImage.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.floor(Math.random() * 255);
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = patternAlpha; // 0-255
      }
      tileCtx.putImageData(tileImage, 0, 0);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const w = fullScreen ? window.innerWidth : (parent?.clientWidth || window.innerWidth);
      const h = fullScreen ? window.innerHeight : (parent?.clientHeight || window.innerHeight);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = fullScreen ? "100vw" : "100%";
      canvas.style.height = fullScreen ? "100vh" : "100%";
      // recreate tile at current dpr
      makeTile();
    };

    const drawTiled = () => {
      if (!tileCanvas || !tileCtx) return;
      // clear main canvas (only alpha blend)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // set composite for a subtle overlay; caller CSS can set mix-blend-mode
      // scale tile drawing by patternScaleX / patternScaleY
      const tileW = Math.round(tileCanvas.width * patternScaleX);
      const tileH = Math.round(tileCanvas.height * patternScaleY);

      // iterate and draw tiles - stepping by tileW/H
      for (let x = 0; x < canvas.width; x += tileW) {
        for (let y = 0; y < canvas.height; y += tileH) {
          ctx.drawImage(tileCanvas as HTMLCanvasElement, 0, 0, tileCanvas.width, tileCanvas.height, x, y, tileW, tileH);
        }
      }
    };

    const loop = () => {
      // refresh tile every N frames to create flicker effect
      if (frameRef.current % Math.max(1, patternRefreshInterval) === 0) {
        makeTile();
      }
      drawTiled();
      frameRef.current++;
      rafRef.current = window.requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
    };

    resize();
    loop();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      tileCanvas = null;
      tileCtx = null;
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, fullScreen]);

  return <canvas className="noise-overlay" ref={grainRef} aria-hidden="true" />;
};

export default Noise;

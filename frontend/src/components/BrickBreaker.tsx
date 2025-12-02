'use client';
import React, { useEffect, useRef } from 'react';

type Props = { width?: number; height?: number };

export default function BrickBreaker({ width = 720, height = 420 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.width = width;
    let h = canvas.height = height;

    // Game state
    const paddle = { w: 110, h: 12, x: (w - 110) / 2, y: h - 36, speed: 8 };
    const ball = { x: w / 2, y: h - 60, r: 7.5, vx: 4 * (Math.random() > 0.5 ? 1 : -1), vy: -4.5 };
    const rows = 4;
    const cols = 8;
    const brickW = Math.floor((w - 80) / cols);
    const brickH = 20;
    const bricks: { x: number; y: number; alive: boolean }[] = [];
    const paddingLeft = 40;
    const paddingTop = 40;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({ x: paddingLeft + c * (brickW + 6), y: paddingTop + r * (brickH + 8), alive: true });
      }
    }
    let lives = 3;
    let isRunning = true;
    let mouseDown = false;
    let lastTime = performance.now();

    function resetBall() {
      ball.x = w / 2;
      ball.y = h - 60;
      ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
      ball.vy = -4.5;
    }

    // Input
    function onMove(e: MouseEvent | TouchEvent) {
      const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      // map to canvas
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      paddle.x = Math.min(Math.max(0, x - paddle.w / 2), w - paddle.w);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - paddle.speed * 2);
      if (e.key === 'ArrowRight') paddle.x = Math.min(w - paddle.w, paddle.x + paddle.speed * 2);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('keydown', onKey);

    function draw() {
      // clear
      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, w, h);

      // bricks
      bricks.forEach((b, i) => {
        if (!b.alive) return;
        const row = Math.floor(i / cols);
        // colored bricks
        const colors = ['#ffb86b','#ff7a7a','#ffd36b','#7bd389'];
        ctx.fillStyle = colors[row % colors.length];
        roundRect(ctx, b.x, b.y, brickW, brickH, 6, true, false);
        ctx.strokeStyle = 'rgba(0,0,0,0.14)';
        ctx.strokeRect(b.x, b.y, brickW, brickH);
      });

      // paddle
      ctx.fillStyle = '#f3c24b';
      roundRect(ctx, paddle.x, paddle.y, paddle.w, paddle.h, 6, true, false);

      // ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // HUD
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(`Lives: ${lives}`, 14, h - 12);
      ctx.fillText(`Bricks: ${bricks.filter(b => b.alive).length}`, w - 110, h - 12);
    }

    function step(now: number) {
      const dt = Math.min(30, now - lastTime);
      lastTime = now;
      if (isRunning) {
        // move ball
        ball.x += ball.vx * (dt / 16);
        ball.y += ball.vy * (dt / 16);

        // collisions with walls
        if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx *= -1; }
        if (ball.x + ball.r > w) { ball.x = w - ball.r; ball.vx *= -1; }
        if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy *= -1; }

        // paddle collision
        if (ball.y + ball.r >= paddle.y && ball.y + ball.r <= paddle.y + paddle.h + 8) {
          if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
            // reflect with angle depending where it hits
            const rel = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2); // -1..1
            const speed = Math.hypot(ball.vx, ball.vy);
            const angle = rel * (Math.PI / 3); // max 60deg
            ball.vx = speed * Math.sin(angle);
            ball.vy = -Math.abs(speed * Math.cos(angle));
          }
        }

        // bricks collision
        for (const b of bricks) {
          if (!b.alive) continue;
          if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + brickW && ball.y + ball.r > b.y && ball.y - ball.r < b.y + brickH) {
            b.alive = false;
            ball.vy *= -1;
            break;
          }
        }

        // bottom (miss)
        if (ball.y - ball.r > h) {
          lives--;
          if (lives <= 0) {
            // game over
            isRunning = false;
            // dispatch lose event, allow restart
            setTimeout(() => {
              // reset small portion
              lives = 3;
              bricks.forEach(b => (b.alive = true));
              resetBall();
              isRunning = true;
            }, 1000);
          } else {
            resetBall();
          }
        }

        // all bricks cleared -> win
        if (bricks.every(b => !b.alive)) {
          isRunning = false;
          // award coupon via custom event
          const code = `RIBBON20-${Math.floor(Math.random() * 9000 + 1000)}`;
          window.dispatchEvent(new CustomEvent('ribbony:game:win', { detail: { code } }));
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    }

    // util draw rounded rect
    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill = true, stroke = true) {
      const min = Math.min(w, h) / 2;
      if (r > min) r = min;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    // start
    rafRef.current = requestAnimationFrame(step);

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('keydown', onKey);
    };
  }, [width, height]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: width, borderRadius: 8 }} />
    </div>
  );
}

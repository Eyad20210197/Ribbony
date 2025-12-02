// src/components/VintageSquares.tsx
'use client';
import React, { useMemo } from 'react';

type Props = { count?: number; density?: number };

function rand(min:number,max:number){return Math.random()*(max-min)+min;}

export default function VintageSquares({ count = 24, density = 0.9 }: Props) {
  const squares = useMemo(()=> new Array(count).fill(0).map((_,i) => {
    const left = `${Math.round(rand(0,100))}%`;
    const top = `${Math.round(rand(0,100))}%`;
    const size = Math.round(rand(32,110));
    const delay = rand(-20,5).toFixed(2);
    const dur = rand(8,24).toFixed(2);
    const op = (rand(0.15,0.9)*density).toFixed(2);
    const rot = Math.round(rand(-6,6));
    return {id:i,left,top,size,delay,dur,op,rot};
  }), [count,density]);

  return (
    <>
      <div className="vintage-squares-overlay" aria-hidden>
        {squares.map(s => (
          <div
            key={s.id}
            className="vintage-square"
            style={{
              left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`,
              opacity: Number(s.op), transform:`rotate(${s.rot}deg)`,
              transition: `transform ${s.dur}s ease-in-out`, animationDelay: `${s.delay}s`
            }}
          />
        ))}
      </div>

      {/* grid & film overlays */}
      <div className="vintage-grid" aria-hidden />
      <div className="scanlines" aria-hidden />
    </>
  );
}

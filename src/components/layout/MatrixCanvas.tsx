'use client';

import React, { useEffect, useRef } from 'react';

export function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const cols = Math.floor(w / 20) + 1;
    const ypos = Array(cols).fill(0);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const matrix = () => {
      if (!ctx) return;
      // Use a lower alpha for less performance impact
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#0f0'; // Green text
      ctx.font = '15pt monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        ctx.fillText(text, x, y);

        if (y > 100 + Math.random() * 10000) {
          ypos[ind] = 0;
        } else {
          ypos[ind] = y + 20;
        }
      });
    };

    // Lower the interval frequency for better performance
    const intervalId = setInterval(matrix, 100); 

    const handleResize = () => {
      if (!canvas || !ctx) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const newCols = Math.floor(w / 20) + 1;
      ypos.length = 0; 
      ypos.push(...Array(newCols).fill(0));
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1, 
        opacity: 0.5, 
        pointerEvents: 'none' // Ensure it doesn't block interactions
      }}
    />
  );
} 
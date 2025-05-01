'use client'; // Required for useEffect and useRef

import React, { useRef, useEffect } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let intervalId: number;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrix = "ᶜʳᵃˢʰ ᵗʰᵉ ʷᵒʳˡᵈ".split("");
      const fontSize = 18; // Slightly increased for better visibility
      const columns = Math.floor(canvas.width / fontSize);
      // Initialize drops with random starting heights
      const drops = Array(columns).fill(0).map(() => Math.random() * canvas.height / 2); // Start randomly in the top half
      // Initialize random phrase starting offset for each column
      const phraseOffsets = Array(columns).fill(0).map(() => Math.floor(Math.random() * matrix.length));

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#39FF14"; // Neon Green
        ctx.font = `${fontSize}px monospace`; // Use monospace for better alignment

        for (let i = 0; i < drops.length; i++) {
          // Calculate character index based on drop position AND column offset modulo phrase length
          const charIndex = (Math.floor(drops[i]) + phraseOffsets[i]) % matrix.length;
          // Ensure index is valid
          const safeIndex = (charIndex + matrix.length) % matrix.length;
          const text = matrix[safeIndex];
          // x = i*font_size, y = value of drops[i]*font_size
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          //sending the drop back to the top randomly after it has crossed the screen
          //adding a randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          //incrementing Y coordinate
          drops[i]++;
        }
      };

      // Clear previous interval if exists
      if (intervalId) clearInterval(intervalId);
      // Use setInterval for the fixed rate animation
      intervalId = window.setInterval(draw, 35); // Use window.setInterval
    };

    setupCanvas(); // Initial setup

    const handleResize = () => {
       // Recalculate and reset on resize
       // Debouncing could be added here for performance if needed
       setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
    };

  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block', // Prevent extra space below canvas
        position: 'fixed', // Fixed position to cover viewport
        top: 0,
        left: 0,
        width: '100vw', // Cover full viewport width
        height: '100vh', // Cover full viewport height
        zIndex: -1, // Place it behind other content
        background: 'black', // Ensure background is black
      }}
    />
  );
};

export { MatrixBackground }; 
'use client'; // Required for useEffect and useRef

import React, { useRef, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext'; // Import useSettings

// Helper function defined locally
const hexToRgba = (hex: string, alpha: number): string => {
  let cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  if (cleanHex.length !== 6) {
    console.error("Invalid hex color for rgba conversion:", hex);
    // Return a default fallback color (e.g., transparent black) or throw error
    return `rgba(0, 0, 0, ${alpha})`; 
  }
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
     console.error("Failed to parse hex color:", hex);
     return `rgba(0, 0, 0, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useSettings(); // Get settings

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let intervalId: number;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrix = "  ᶜʳᵃˢʰ ᵗʰᵉ ʷᵒʳˡᵈ".split(""); // Keep leading spaces
      const baseFontSize = 18; // Base font size
      
      // Define depth layers (z-axis) - higher number = farther away
      const columns: {
        x: number;         // x position
        xPercent: number;  // position as percentage of width (0-1)
        y: number;         // y position
        z: number;         // z depth (0-1, where 1 is farthest)
        speed: number;     // drop speed
        phraseOffset: number; // offset in the phrase
        fontSize: number;  // scaled by depth
      }[] = [];
      
      // Create columns with depths based on distance from center
      const totalColumns = Math.floor(canvas.width / (baseFontSize * 0.5)); // Even more densely packed
      const centerX = canvas.width / 2;
      
      for (let i = 0; i < totalColumns; i++) {
        // Calculate x position
        const x = i * (baseFontSize * 0.5);
        // Calculate distance from center as percentage (0 = center, 1 = edge)
        const distFromCenter = Math.abs(x - centerX) / centerX;
        // Invert to get z-depth (0 = closest/edges, 1 = farthest/center)
        const zDepth = 1 - Math.pow(distFromCenter, 0.5); // More pronounced tunnel effect
        
        columns.push({
          x: x,
          xPercent: x / canvas.width,
          y: Math.random() * canvas.height * 0.8, // Random start position
          z: zDepth,
          speed: 1.8 - zDepth * 1.2, // Bigger speed difference between center and sides
          phraseOffset: Math.floor(Math.random() * matrix.length),
          fontSize: baseFontSize * (1 - zDepth * 0.8) // More dramatic size difference
        });
      }
      
      // Sort columns by z-depth for proper rendering (back to front)
      columns.sort((a, b) => b.z - a.z);
      
      // Add subtle perspective shift based on mouse position
      let mouseX = 0;
      let mouseY = 0;
      
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / canvas.width - 0.5) * 2; // -1 to 1
        mouseY = (e.clientY / canvas.height - 0.5) * 2; // -1 to 1
      };
      
      window.addEventListener('mousemove', handleMouseMove);

      const draw = () => {
        // Use theme background color for trailing effect
        ctx.fillStyle = hexToRgba(settings.colors.background, 0.05); // Low opacity background fill
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw each column with z-based properties
        for (const column of columns) {
          // Apply perspective shift based on mouse position and depth
          // Enhanced tunnel effect: larger shift for center columns based on mouse
          const perspectiveShift = mouseX * 40 * column.z; // More dramatic shift for center
          
          // Apply a subtle "breathing" effect to make the tunnel seem alive
          const time = Date.now() / 3000; // Slow cycle
          const breathingEffect = Math.sin(time + column.xPercent * Math.PI * 2) * 5 * column.z;
          
          // Combined effects
          const drawX = column.x + perspectiveShift + breathingEffect;
          
          // Apply subtle y-shift for vertical mouse movement
          const yPerspectiveShift = mouseY * 30 * column.z;
          
          // Calculate character and position
          const charIndex = (Math.floor(column.y / 20) + column.phraseOffset) % matrix.length;
          const safeIndex = (charIndex + matrix.length) % matrix.length;
          const text = matrix[safeIndex];
          
          // Set opacity and color based on depth using theme colors
          const opacity = 0.2 + 0.8 * (1 - column.z * 0.9); // Opacity based on depth
          
          // Blend primary and secondary colors based on depth (more secondary further away)
          // This requires converting hex to RGB. We use the imported hexToRgba for fillStyle
          const primaryColorRgba = hexToRgba(settings.colors.primary, opacity);
          
          // Simple additive blend for effect (might need adjustment)
          // For simplicity, let's primarily use primary color with opacity
          ctx.fillStyle = primaryColorRgba;
          
          // Set font based on calculated size
          ctx.font = `${column.fontSize}px monospace`;
          
          // Draw the character with the y position also affected by perspective
          ctx.fillText(text, drawX, column.y + yPerspectiveShift);
          
          // Update position for next frame - speed varies with depth
          column.y += column.speed;
          
          // Reset when it goes off screen
          if (column.y > canvas.height && Math.random() > 0.97) {
            column.y = 0;
          }
        }
      };

      // Use setInterval for the animation
      if (intervalId) clearInterval(intervalId);
      intervalId = window.setInterval(draw, 35);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    };

    const cleanupFn = setupCanvas();

    const handleResize = () => {
      if (cleanupFn) cleanupFn();
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
      if (cleanupFn) cleanupFn();
    };

  }, [settings]); // Add settings to dependency array

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: settings.colors.background, // Use theme background
      }}
    />
  );
};

export { MatrixBackground }; 
'use client'; // Required for useEffect and useRef

import React, { useRef, useEffect } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let intervalId: number;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const phrase = "ᶜʳᵃˢʰ ᵗʰᵉ ʷᵒʳˡᵈ";
      const matrix = phrase.split("");
      const fontSize = 18;
      
      // 3D space configuration
      const fov = 250; // Field of view
      const depth = 20; // How many "rows" deep our corridor goes
      const spacing = 40; // Horizontal spacing between characters in the real world
      
      // Create a true 3D grid of characters
      type Point3D = {
        x: number;      // 3D world x position
        y: number;      // 3D world y position
        z: number;      // 3D world z position (depth)
        char: string;   // The character to display
        speed: number;  // How fast it falls
      };
      
      const points: Point3D[] = [];
      
      // Create a grid of points in 3D space
      // We'll create more points at the far end to create density
      for (let z = 1; z <= depth; z++) {
        // How many columns for this row - more columns as we go deeper
        // to create the illusion of consistent spacing when projected
        const rowCols = Math.ceil(canvas.width / (spacing * fov / (fov + z * 200)));
        
        for (let x = 0; x < rowCols; x++) {
          // Position in real 3D world space
          // Center the row horizontally
          const worldX = (x - rowCols/2) * spacing;
          
          // Random height positions spread throughout the scene
          // Higher density of points for distant rows
          const density = 1 + (z / depth) * 5;
          
          for (let h = 0; h < density; h++) {
            const worldY = Math.random() * canvas.height * 2 - canvas.height / 2;
            
            const charIdx = Math.floor(Math.random() * matrix.length);
            
            points.push({
              x: worldX,
              y: worldY,
              z: z * 200, // z distance (farther = higher number)
              char: matrix[charIdx],
              speed: 1 + (1 - z/depth) * 3 // Speed based on distance
            });
          }
        }
      }
      
      // Sort by z-distance for proper drawing (back to front)
      points.sort((a, b) => b.z - a.z);
      
      const draw = () => {
        // Semi-transparent black for trails
        ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw each point in 3D space
        for (const point of points) {
          // Project 3D point to 2D screen space
          const scale = fov / (fov + point.z);
          const x2d = centerX + point.x * scale;
          const y2d = centerY + point.y * scale;
          
          // Skip if out of bounds
          if (x2d < 0 || x2d > canvas.width || y2d < 0 || y2d > canvas.height) {
            // Update position for next frame
            point.y += point.speed;
            if (point.y > canvas.height / 2) {
              point.y = -canvas.height / 2;
            }
            continue;
          }
          
          // Size based on distance
          const size = Math.max(8, Math.floor(fontSize * scale));
          
          // Color based on distance
          const distance01 = point.z / (depth * 200); // 0-1 range (1 = farthest)
          const greenValue = Math.floor(50 + 205 * (1-distance01));
          const opacity = 0.15 + 0.35 * (0.1-distance01); // Reduced opacity values
          
          ctx.font = `${size}px monospace`;
          ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${opacity})`;
          
          // Draw the character
          ctx.fillText(point.char, x2d, y2d);
          
          // Update position for next frame
          point.y += point.speed;
          
          // Reset when it falls out of view
          if (point.y > canvas.height / 2) {
            point.y = -canvas.height / 2;
          }
        }
      };
      
      // Start animation
      if (intervalId) clearInterval(intervalId);
      intervalId = window.setInterval(draw, 35);
    };
    
    setupCanvas(); // Initial setup
    
    const handleResize = () => {
      setupCanvas(); // Reset on window resize
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  
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
        background: 'black',
      }}
    />
  );
};

export { MatrixBackground }; 
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
      // Ensure canvas fills entire viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const phrase = "ᶜʳᵃˢʰ ᵗʰᵉ ʷᵒʳˡᵈ";
      const matrix = phrase.split("");
      const fontSize = 18;
      
      // 3D space configuration - HEAVILY REDUCED FOR PERFORMANCE
      const fov = 250; // Field of view
      const depth = 10; // Drastically reduced depth (was 15)
      const spacing = 90; // Much larger spacing (was 60)
      
      // Create a true 3D grid of characters
      type Point3D = {
        x: number;      // 3D world x position
        y: number;      // 3D world y position
        z: number;      // 3D world z position (depth)
        char: string;   // The character to display
        speed: number;  // How fast it falls
      };
      
      const points: Point3D[] = [];
      
      // MINIMAL grid of points in 3D space
      for (let z = 1; z <= depth; z++) {
        // Skip two out of every three rows for distant rows
        if (z < depth/2 && z % 3 !== 0) continue;
        
        // Even more reduced column density
        const rowCols = Math.ceil(canvas.width / (spacing * fov / (fov + z * 200)));
        
        for (let x = 0; x < rowCols; x++) {
          // Skip 2 out of 3 columns for most rows
          if (z < depth*0.7 && x % 3 !== 0) continue;
          
          // Position in real 3D world space
          const worldX = (x - rowCols/2) * spacing;
          
          // BARE MINIMUM character density
          // For most rows just 1 character per column, only more for the farthest rows
          const density = (z > depth*0.8) ? 1 + Math.floor((z / depth) * 2) : 1;
          
          for (let h = 0; h < density; h++) {
            // Spread out the characters vertically
            const worldY = Math.random() * canvas.height * 3 - canvas.height * 1.5;
            
            const charIdx = Math.floor(Math.random() * matrix.length);
            
            points.push({
              x: worldX,
              y: worldY,
              z: z * 200,
              char: matrix[charIdx],
              speed: 1 + (1 - z/depth) * 2 // Reduced speed variance
            });
          }
        }
      }
      
      // Sort by z-distance for proper drawing (back to front)
      points.sort((a, b) => b.z - a.z);
      
      // Performance optimization - log the drastically reduced point count
      console.log(`Rendering ${points.length} matrix points (minimal version)`);
      
      const draw = () => {
        // Semi-transparent black for trails
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; // Slightly darker trails to compensate for fewer points
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw each point in 3D space
        for (const point of points) {
          // Project 3D point to 2D screen space
          const scale = fov / (fov + point.z);
          const x2d = centerX + point.x * scale;
          const y2d = centerY + point.y * scale;
          
          // Very aggressive culling - don't even process points far off screen
          if (x2d < -200 || x2d > canvas.width + 200 || y2d < -200 || y2d > canvas.height + 200) {
            // Update position for next frame
            point.y += point.speed;
            // Reset when it falls too far
            if (point.y > canvas.height * 1.5) {
              point.y = -canvas.height * 1.5;
            }
            continue;
          }
          
          // Make characters slightly larger to compensate for fewer of them
          const size = Math.max(9, Math.floor(fontSize * scale * 1.3));
          
          // Color based on distance
          const distance01 = point.z / (depth * 200);
          const greenValue = Math.floor(50 + 205 * (1-distance01));
          const opacity = 0.4 + 0.6 * (1-distance01); // Slightly higher minimum opacity
          
          ctx.font = `${size}px monospace`;
          ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${opacity})`;
          
          // Draw the character
          ctx.fillText(point.char, x2d, y2d);
          
          // Update position for next frame
          point.y += point.speed;
          
          // Reset when it falls out of view
          if (point.y > canvas.height * 1.5) {
            point.y = -canvas.height * 1.5;
          }
        }
      };
      
      // Start animation with a much lower framerate for better performance
      if (intervalId) clearInterval(intervalId);
      intervalId = window.setInterval(draw, 50); // Even longer interval (was 40ms)
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
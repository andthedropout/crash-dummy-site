'use client'; // Required for useEffect and useRef

import React, { useRef, useEffect } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext'; // Import the hook

// Helper function for smoother interpolation
const smoothStep = (min: number, max: number, value: number): number => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x); // Smooth step function for more organic transitions
};

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Consume audio data from context - Removed unused bassLevel
  const { audioVolume } = useMusicPlayer(); 
  
  // Store and access volume in a ref for animation frame
  const volumeRef = useRef(audioVolume);
  // Add a ref for smoothed volume for extra smoothing in the render
  const smoothedVolumeRef = useRef(0);
  
  // Update the ref when the volume changes
  useEffect(() => {
    volumeRef.current = audioVolume;
  }, [audioVolume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const setupCanvas = () => {
      // Ensure canvas fills entire viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const phrase = "ᶜʳᵃˢʰ ᵈᵘᵐᵐʸ ᵗʰᵉ ʷᵒʳˡᵈ";
      const matrix = phrase.split("");
      const fontSize = 18;
      
      // 3D space configuration
      const fov = 250; // Field of view
      const depth = 60; // Depth of field
      const spacing = 110; // Character spacing
      
      // Create a true 3D grid of characters
      type Point3D = {
        x: number;      // 3D world x position
        y: number;      // 3D world y position
        z: number;      // 3D world z position (depth)
        char: string;   // The character to display
        baseSpeed: number; // Store base speed
        currentSpeed: number; // Store current speed for update
        lastColorR: number; // Store last color values for smoother transitions
        lastColorG: number;
        lastColorB: number;
        lastOpacity: number;
        lastSize: number;
        originalX: number; // Store original X for controlling swirl effect
      };
      
      const points: Point3D[] = [];
      
      // Create grid of points in 3D space
      for (let z = 1; z <= depth; z++) {
        // Skip some rows for performance
        if (z < depth/2 && z % 3 !== 0) continue;
        
        // Reduced column density
        const rowCols = Math.ceil(canvas.width / (spacing * fov / (fov + z * 200)));
        
        for (let x = 0; x < rowCols; x++) {
          // Skip some columns for performance
          if (z < depth*0.7 && x % 3 !== 0) continue;
          
          // Position in real 3D world space
          const worldX = (x - rowCols/2) * spacing;
          
          // Adjust character density based on depth
          const density = (z > depth*0.8) ? 1 + Math.floor((z / depth) * 2) : 1;
          
          for (let h = 0; h < density; h++) {
            // Spread out the characters vertically
            const worldY = Math.random() * canvas.height * 3 - canvas.height * 1.5;
            
            const charIdx = Math.floor(Math.random() * matrix.length);
            
            const baseSpeed = 1 + (1 - z/depth) * 2; // Calculate base speed
            
            // Calculate baseline values for this point's starting state
            const distance01 = (z * 100) / (depth * 200);
            const baseGreen = 50 + 150 * (1 - distance01);
            
            points.push({
              x: worldX,
              y: worldY,
              z: z * 100,
              char: matrix[charIdx],
              baseSpeed: baseSpeed,
              currentSpeed: baseSpeed, // Initialize current speed
              lastColorR: 0,
              lastColorG: baseGreen,
              lastColorB: 0,
              lastOpacity: 0.1,
              lastSize: Math.floor(fontSize * (fov / (fov + z * 100))),
              originalX: worldX,
            });
          }
        }
      }
      
      // Sort by z-distance for proper drawing (back to front)
      points.sort((a, b) => b.z - a.z);
      
      console.log(`Rendering ${points.length} matrix points (volume reactive matrix)`);
      
      // For controlling swirl animation timing
      let time = 0;
      
      const draw = () => {
        // Only increment the time when volume is above threshold
        // This controls the swirl animation
        const volumeThreshold = 0.35; // Lower threshold so swirl activates more easily
        // Always have a minimal animation, but increase speed with volume
        const baseSwirlingSpeed = 0.2225; // Constant base animation speed
        const volumeDrivenSpeed = volumeRef.current > volumeThreshold ? 
                                 (volumeRef.current - volumeThreshold) * 0.915 : 0;
        time += baseSwirlingSpeed + volumeDrivenSpeed;

        // Additional smoothing using lerp for the visual effect
        const volumeLerpFactor = 0.1; // Moderate smoothing for responsiveness
        smoothedVolumeRef.current = smoothedVolumeRef.current * (1 - volumeLerpFactor) + 
                                   volumeRef.current * volumeLerpFactor;
        
        const currentVolume = smoothedVolumeRef.current;

        // Semi-transparent black for trails
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (const point of points) {
          // Calculate the swirl effect based on volume
          // Always have a minimal swirl, but increase magnitude with volume
          const baseSwirl = Math.sin(time + point.z / 500) * 5; // Base swirl always present
          
          // Additional swirl based on volume
          const volumeSwirl = currentVolume > volumeThreshold ?
                             Math.sin(time * 1.5 + point.z / 400) * 20 * (currentVolume - volumeThreshold) : 0;
          
          // Combine the two swirl effects
          const x = point.originalX + baseSwirl + volumeSwirl;
          
          // Project 3D point to 2D screen space
          const scale = fov / (fov + point.z);
          const x2d = centerX + x * scale;
          const y2d = centerY + point.y * scale;
          
          // Skip if off-screen
          if (x2d < -200 || x2d > canvas.width + 200 || y2d < -200 || y2d > canvas.height + 200) {
            point.y += point.currentSpeed; 
            if (point.y > canvas.height * 1.5) {
              point.y = -canvas.height * 1.5;
            }
            continue;
          }
          
          // --- Modify visuals based on volume --- 
          const volumeEffect = smoothStep(0, 1, Math.pow(currentVolume, 1.5) * 1.2);
          
          // Size pulse: Characters grow with volume but maintain minimum visibility
          // Ensure a minimum size that's clearly visible
          const baseSize = Math.max(fontSize * scale * 0.9, 12); // Base size that's always visible
          const dynamicSizeIncrease = fontSize * scale * 0.3 * volumeEffect; // Additional size based on volume
          const targetSize = Math.max(9, Math.floor(baseSize + dynamicSizeIncrease));
          const sizeLerpFactor = 0.15;
          const newSize = Math.floor(point.lastSize * (1 - sizeLerpFactor) + targetSize * sizeLerpFactor);
          
          const distance01 = point.z / (depth * 200);
          
          // Color: Always have a base green with minimum visibility, then flash brighter with volume
          const baseGreen = 50 + 150 * (1 - distance01); 
          
          // Ensure minimum base colors are visible even with no volume
          const minRed = 100; // Minimum red component
          const minGreen = Math.max(30, baseGreen * 0.3); // Minimum green component
          const minBlue = 100; // Minimum blue component
          
          // Flash boost is additional brightness from volume
          const flashBoost = 255 * volumeEffect; 

          // Target colors with minimums to ensure visibility
          const targetR = Math.min(255, minRed + Math.floor(flashBoost * 0.8)); 
          const targetG = Math.min(255, minGreen + Math.floor(flashBoost * 0.9));
          const targetB = Math.min(255, minBlue + Math.floor(flashBoost * 0.7)); 
          
          // Smooth color transitions
          const colorLerpFactor = 0.1;
          const newR = Math.floor(point.lastColorR * (1 - colorLerpFactor) + targetR * colorLerpFactor);
          const newG = Math.floor(point.lastColorG * (1 - colorLerpFactor) + targetG * colorLerpFactor);
          const newB = Math.floor(point.lastColorB * (1 - colorLerpFactor) + targetB * colorLerpFactor);
          
          // Opacity: Ensure base visibility with minimum opacity
          const minOpacity = 0.2 + ((1 - distance01) * 0.15); // Distance-based minimum opacity (closer = more visible)
          const dynamicOpacity = 0.6 * volumeEffect; // Additional opacity based on volume
          const targetOpacity = Math.min(1, minOpacity + dynamicOpacity);
          
          // Smooth opacity transition
          const opacityLerpFactor = 0.15;
          const newOpacity = point.lastOpacity * (1 - opacityLerpFactor) + targetOpacity * opacityLerpFactor;
          
          ctx.font = `${newSize}px monospace`;
          ctx.fillStyle = `rgba(${newR}, ${newG}, ${newB}, ${newOpacity})`;
          ctx.fillText(point.char, x2d, y2d);
          
          // Update last values for smooth transitions
          point.lastSize = newSize;
          point.lastColorR = newR;
          point.lastColorG = newG;
          point.lastColorB = newB;
          point.lastOpacity = newOpacity;
          
          // Speed up movement slightly with volume
          const speedMultiplier = 1 + volumeEffect * 0.5;
          point.currentSpeed = point.baseSpeed * speedMultiplier;
          point.y += point.currentSpeed;
          
          if (point.y > canvas.height * 1.5) {
            point.y = -canvas.height * 1.5;
            // Occasionally randomize character on loop when volume is high
            if (currentVolume > 0.3 && Math.random() < 0.2) {
              point.char = matrix[Math.floor(Math.random() * matrix.length)];
            }
          }
        }
        
        // Request next frame for smoother animation
        animationFrameId = requestAnimationFrame(draw);
      };
      
      // Start animation
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(draw);
    };
    
    setupCanvas(); // Initial setup
    
    const handleResize = () => {
      setupCanvas(); // Reset on window resize
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
'use client'; // Required for useEffect and useRef

import React, { useRef, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useSettings();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let intervalId: number;
    
    // We'll use a simulated pulsing effect for sound reactivity instead of mic access
    let pulseValue = 0;
    let increasing = true;
    
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrix = "  ᶜʳᵃˢʰ ᵗʰᵉ ʷᵒʳˡᵈ".split("");
      const fontSize = 16; // Slightly increased for better visibility
      const columns = Math.floor(canvas.width / fontSize);
      // Initialize drops with random starting heights
      const drops = Array(columns).fill(0).map(() => Math.random() * canvas.height / 2); // Start randomly in the top half
      // Initialize random phrase starting offset for each column
      const phraseOffsets = Array(columns).fill(0).map(() => Math.floor(Math.random() * matrix.length));

      const draw = () => {
        // Set background color from settings
        ctx.fillStyle = `${settings.colors.background}04`; // Add alpha transparency
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set primary text color from settings
        ctx.fillStyle = settings.colors.primary;
        ctx.font = `${fontSize}px monospace`; // Use monospace for better alignment

        // Update pulse value for simulated sound reactivity
        if (settings.soundReactivity.enabled) {
          if (increasing) {
            pulseValue += 0.05 * settings.soundReactivity.intensity;
            if (pulseValue >= 1) {
              pulseValue = 1;
              increasing = false;
            }
          } else {
            pulseValue -= 0.05 * settings.soundReactivity.intensity;
            if (pulseValue <= 0) {
              pulseValue = 0;
              increasing = true;
            }
          }
        }
        
        // Scale for visual effect
        const intensity = settings.soundReactivity.enabled ? 1 + pulseValue : 1;

        for (let i = 0; i < drops.length; i++) {
          // Calculate character index based on drop position AND column offset modulo phrase length
          const charIndex = (Math.floor(drops[i]) + phraseOffsets[i]) % matrix.length;
          // Ensure index is valid
          const safeIndex = (charIndex + matrix.length) % matrix.length;
          const text = matrix[safeIndex];
          
          // Apply sound reactivity styling adjustments
          if (settings.soundReactivity.enabled && i % 3 === 0) {
            // Use secondary color and adjust font size based on intensity
            ctx.fillStyle = settings.colors.secondary; 
            ctx.font = `${fontSize * intensity}px monospace`;
          } else {
            // Default state
            ctx.fillStyle = settings.colors.primary;
            ctx.font = `${fontSize}px monospace`;
          }
          
          // x = i*font_size, y = value of drops[i]*font_size
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          //sending the drop back to the top randomly after it has crossed the screen
          //adding a randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          //incrementing Y coordinate with intensity if sound reactivity is enabled
          drops[i] += settings.soundReactivity.enabled ? 0.5 + (intensity * 0.5) : 1;
        }
      };

      // Clear previous interval if exists
      if (intervalId) clearInterval(intervalId);
      // Use setInterval for the fixed rate animation
      intervalId = window.setInterval(draw, 35); // Use window.setInterval
    };

    // Initialize
    setupCanvas();

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

  }, [settings]); // Add settings as dependency to update when settings change

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
        background: settings.colors.background, // Use background color from settings
      }}
    />
  );
};

export { MatrixBackground }; 
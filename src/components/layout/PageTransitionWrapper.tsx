'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const pathname = usePathname(); // Get current route
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset loading states on route change
    setLoading(true);
    setShowOverlay(true);
    
    // This ensures the page starts black and only shows content when ready
    // Small delay to ensure all initial animations are set up
    const animationSetupDelay = setTimeout(() => {
      // First fade out the overlay
      if (overlayRef.current) {
        overlayRef.current.classList.add('fade-out');
      }
      
      // Then after the overlay fades, show the content
      const contentDelay = setTimeout(() => {
        setLoading(false);
        setShowOverlay(false);
      }, 300); // Match this with the transition duration in CSS
      
      return () => clearTimeout(contentDelay);
    }, 100);

    return () => clearTimeout(animationSetupDelay);
  }, [pathname]); // Re-run effect when path changes

  return (
    <>
      {/* Black overlay with fade-out capability */}
      {showOverlay && (
        <div 
          ref={overlayRef}
          className="page-transition-wrapper" 
        />
      )}
      
      {/* 
        Key based on pathname forces complete remount when route changes
        This ensures animations start fresh every time
      */}
      <div 
        key={`page-${pathname}`} 
        className={loading ? 'preload-animation' : ''}
      >
        {children}
      </div>
    </>
  );
}; 
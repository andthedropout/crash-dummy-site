'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Use Next.js Image for optimization
import { motion } from 'framer-motion';
import { usePageTransition } from '@/components/layout/PageTransitionContext';

interface ProducerCardProps {
  imgurl: string;
  title: string;
  isSelected: boolean; // To apply different styles when selected
  link?: string; // Optional link property
}

export const ProducerCard: React.FC<ProducerCardProps> = ({ imgurl, title, isSelected, link }) => {
  const { startTransition } = usePageTransition();
  const [isHovering, setIsHovering] = useState(false);
  const [particleCount] = useState(() => Math.floor(Math.random() * 20) + 20);
  const [particles, setParticles] = useState<Array<{ x: number, y: number, size: number, speed: number, angle: number }>>([]);
  
  // Generate random particles on mount
  useEffect(() => {
    if (isSelected) {
      const newParticles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 10 + 5,
        angle: Math.random() * 360
      }));
      setParticles(newParticles);
    }
  }, [isSelected, particleCount]);

  const handleCardClick = () => {
    if (link && isSelected) {
      startTransition(link);
    }
  };

  // Helper function for color with fallback
  const getColor = (cssVar: string, fallback: string = '#FFFFFF') => `var(${cssVar}, ${fallback})`;

  return (
    <motion.div 
      className="flex-shrink-0 flex flex-col items-center mx-4 w-48 md:w-56 lg:w-64 transition-opacity duration-300 pointer-events-auto"
      animate={{ 
        scale: isSelected ? 1.2 : 0.8, // Larger when selected, smaller otherwise
        opacity: isSelected ? 1 : 0.5, // Fully opaque when selected, faded otherwise
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCardClick}
    >
      {/* Square Image Container with Cyberpunk Frame */}
      <div 
        className={`relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-2 overflow-hidden rounded-md shadow-lg bg-neutral-800 
          ${isSelected ? 'producer-card-selected' : ''} 
          ${isSelected && isHovering ? 'producer-card-hover' : ''}`}
      > 
        {/* Cyberpunk frame elements - Use page secondary color */}
        {isSelected && (
          <>
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 z-20" style={{ borderColor: getColor('--page-secondary-color', '#90EE90') }}></div>
            <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 z-20" style={{ borderColor: getColor('--page-secondary-color', '#90EE90') }}></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 z-20" style={{ borderColor: getColor('--page-secondary-color', '#90EE90') }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 z-20" style={{ borderColor: getColor('--page-secondary-color', '#90EE90') }}></div>
            
            {/* Inner highlight frame - Use page secondary color */}
            <div className="absolute inset-2 md:inset-3 border z-10" style={{ borderColor: getColor('--page-secondary-color', '#90EE90')+'4D' }}></div> {/* Added 30% opacity */} 
            
            {/* Animated scan line (styled in globals.css with page vars) */}
            <div className="absolute inset-0 overflow-hidden z-15 pointer-events-none">
              <div className="card-scan-line"></div>
            </div>
            
            {/* Tech details - Always white */}
            <div className="absolute top-2 right-2 text-[8px] md:text-[10px] font-mono z-20 tech-data" style={{ color: '#FFFFFF' }}>ID::{title.slice(0,4)}</div>
            <div className="absolute bottom-2 left-2 text-[8px] md:text-[10px] font-mono z-20 tech-data" style={{ color: '#FFFFFF' }}>SYS::ACTIVE</div>
            
            {/* Hover effect elements */}
            {isHovering && (
              <>
                {/* Pulsing selection indicator (styled in globals.css with page vars) */}
                <div className="absolute inset-0 border-2 animate-pulse-fast z-25 pointer-events-none" style={{ borderColor: getColor('--page-secondary-color', '#90EE90') }}></div>
                
                {/* Targeting reticle - Use page primary color */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-20 pointer-events-none target-reticle">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-[10%]" style={{ backgroundColor: getColor('--page-primary-color', '#39FF14')+'99' }}></div> { /* 60% opacity */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-[10%]" style={{ backgroundColor: getColor('--page-primary-color', '#39FF14')+'99' }}></div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[10%] h-1" style={{ backgroundColor: getColor('--page-primary-color', '#39FF14')+'99' }}></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[10%] h-1" style={{ backgroundColor: getColor('--page-primary-color', '#39FF14')+'99' }}></div>
                </div>
                
                {/* Status change text - Use page primary color */}
                <div className="absolute bottom-10 w-full text-center text-xs md:text-sm font-mono z-30 tech-data-flash pointer-events-none" style={{ color: getColor('--page-primary-color', '#39FF14') }}>
                  {title}
                </div>
                
                {/* Particles - Use page primary color */}
                {particles.map((particle, i) => (
                  <div 
                    key={i}
                    className="absolute rounded-full particle-float pointer-events-none"
                    style={{
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      top: `${particle.y}%`,
                      left: `${particle.x}%`,
                      backgroundColor: getColor('--page-primary-color', '#39FF14'),
                      opacity: 0.6,
                      transform: `rotate(${particle.angle}deg)`,
                      boxShadow: `0 0 5px 2px ${getColor('--page-secondary-color', '#90EE90')}4D` // Use secondary for shadow (30% opacity)
                    }}
                  />
                ))}
              </>
            )}
          </>
        )}
        
        <Image
          src={imgurl}
          alt={title}
          layout="fill" // Fill the container
          objectFit="cover" // Cover the area, maintaining aspect ratio
          className="transition-transform duration-300 ease-in-out group-hover:scale-105" // Subtle zoom on hover
        />
        
        {/* Overlay for non-selected cards */}
        {!isSelected && (
          <div className="absolute inset-0 bg-black/50"></div>
        )}
        
        {/* Glitch effect (styled in globals.css with page vars) */}
        {isSelected && isHovering && (
          <div className="absolute inset-0 glitch-overlay z-5 pointer-events-none"></div>
        )}
        
        {/* "Click to select" indicator on hover - Use page primary/secondary */}
        {isSelected && isHovering && link && (
          <div className="absolute bottom-16 left-0 w-full flex justify-center pointer-events-none">
            <div 
              className="bg-black/70 rounded px-2 py-1 text-xs font-mono border action-prompt"
              style={{
                 color: getColor('--page-primary-color', '#39FF14'),
                 borderColor: getColor('--page-secondary-color', '#90EE90')+'80' // Use secondary with 50% opacity
               }}
            >
              [ENTER]
            </div>
          </div>
        )}
      </div>
      
      {/* Title (styled in globals.css with page vars) */}
      <div className={`mt-2 text-center producer-title-container ${isSelected ? 'selected' : ''}`}>
        {isSelected ? (
          <div className={`producer-title-glitch md:producer-title-glitch-desktop ${isHovering ? 'title-hover' : ''}`} 
            data-text={title}>
            {title}
          </div>
        ) : (
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-400">{title}</h3>
        )}
        
        {/* Small tech line beneath selected title - Use page primary */}
        {isSelected && (
          <div 
            className={`text-[8px] md:text-[10px] font-mono mt-1 ${isHovering ? 'status-ready' : ''}`}
            style={{ color: getColor('--page-primary-color', '#39FF14')+'CC' }} // Use primary with 80% opacity
          >
            {isHovering ? 'PROD::[READY]' : 'PROD::[SELECTED]'}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProducerCard } from './ProducerCard';
// import { ChevronLeft, ChevronRight } from 'lucide-react'; // Remove lucide icons
import { CyberpunkButton } from '@/components/ui/CyberpunkButton'; // Import CyberpunkButton

interface Producer {
  imgurl: string;
  title: string;
  link?: string; // Add link property to Producer interface
}

interface ProducerCarouselProps {
  selectedIndex: number;
  producersData: Producer[];
}

export const ProducerCarousel: React.FC<ProducerCarouselProps> = ({ 
  selectedIndex, // Receive from props
  producersData // Receive from props
}) => {
  const [centerOffsetState, setCenterOffsetState] = useState(0); // State for center offset
  const carouselRef = useRef<HTMLDivElement>(null);
  // Updated card widths for responsive design
  const [cardWidth, setCardWidth] = useState(224); // Default for mobile: w-48 (192px) + mx-4 (16px * 2) = 224px
  const [carouselHeight, setCarouselHeight] = useState('300px'); // Default height for mobile

  const updateCenterOffset = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Update card width based on screen size
      let newCardWidth = 224; // Mobile default
      let newHeight = '300px'; // Mobile default
      
      if (window.innerWidth >= 1024) {
        newCardWidth = 288; // Desktop lg: w-64 (256px) + mx-4 (16px * 2) = 288px
        newHeight = '400px'; // Taller for desktop lg
      } else if (window.innerWidth >= 768) {
        newCardWidth = 256; // Desktop md: w-56 (224px) + mx-4 (16px * 2) = 256px
        newHeight = '350px'; // Taller for desktop md
      }
      
      setCardWidth(newCardWidth);
      setCarouselHeight(newHeight);
      setCenterOffsetState(window.innerWidth / 2 - newCardWidth / 2);
    }
  }, []); // No dependencies needed

  // Effect for initial calculation and resize handling
  useEffect(() => {
    updateCenterOffset(); // Initial calculation
    window.addEventListener('resize', updateCenterOffset);
    return () => window.removeEventListener('resize', updateCenterOffset);
  }, [updateCenterOffset]); // Depend on the callback

  const calculateX = useMemo(() => {
    // Uses selectedIndex from props now
    return centerOffsetState - selectedIndex * cardWidth;
  }, [selectedIndex, centerOffsetState, cardWidth]);

  return (
    <div className="relative w-full flex flex-col py-10">
      {/* Carousel Track - Make track ignore pointer events */}
      <motion.div
        ref={carouselRef}
        className="flex items-center cursor-grab pointer-events-none" /* Added pointer-events-none */
        animate={{ x: calculateX }}
        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
        style={{ height: carouselHeight }} 
      >
        {/* Use producersData from props */}
        {producersData.map((producer, index) => (
          <ProducerCard
            key={producer.title + index} 
            imgurl={producer.imgurl}
            title={producer.title}
            link={producer.link} // Pass the link property to ProducerCard
            isSelected={index === selectedIndex} // Compare with selectedIndex from props
          />
        ))}
      </motion.div>

      {/* REMOVE Navigation Arrows section completely */}
      {/* 
      <div className="absolute bottom-0 ... z-50">
         ... buttons ... 
      </div>
      */}
    </div>
  );
}; 
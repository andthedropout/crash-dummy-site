'use client'; // Required because child components use client hooks

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimate } from 'framer-motion';
import Tilt from 'react-parallax-tilt'; // Import Tilt
import { MatrixBackground as MatrixBackground2 } from '@/components/layout/MatrixBackground2'; // Use named import and alias it
import { ProducerCarousel } from '@/components/producers/ProducerCarousel'; // Import the carousel
import { CyberpunkButton } from '@/components/ui/CyberpunkButton'; // Import the button
import { CyberSquareButton } from '@/components/ui/CyberSquareButton'; // Import the square button
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { useSettings } from '@/context/SettingsContext'; // Import useSettings

// Updated Producer Data with specific names and placeholders
const sampleProducers = [
  { imgurl: "/producers/DSC_4494-1.jpg", title: "Tm88", link: "/producers/tm88" },
  { imgurl: "/producers/Akachi-1.jpeg", title: "Akachi Glo", link: "/producers/akachi-glo" }, 
  { imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Cash 88", link: "/producers/cash-88" },
  { imgurl: "/producers/Dante-Smith.jpg", title: "Dante Smith", link: "/producers/dante-smith" },
  { imgurl: "/producers/DJ-Moon-scaled.jpg", title: "DJ Moon", link: "/producers/dj-moon" },
  { imgurl: "/producers/Lexx-Darkstar.jpeg", title: "Lexx Darkstar", link: "/producers/lexx-darkstar" },
  { imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Lunch 77", link: "/producers/lunch-77" },
  { imgurl: "/producers/Macnificent-scaled.jpg", title: "Macnificent", link: "/producers/macnificent" },
  { imgurl: "/producers/Rozay-Knockin-scaled.jpg", title: "Rozay Knockin", link: "/producers/rozay-knockin" },
  { imgurl: "/producers/Sid.jpg", title: "Sid", link: "/producers/sid" },
  { imgurl: "/producers/Slo-Meezy-scaled.jpg", title: "Slo Meezy", link: "/producers/slo-meezy" },
  { imgurl: "/producers/Crash-Dummy-Placeholder.png", title: "Too Dope", link: "/producers/too-dope" },
  { imgurl: "/producers/kmaddxx.jpg", title: "kmaddxx", link: "/producers/kmaddxx" },
  { imgurl: "/producers/Yung-Icey-scaled.jpg", title: "Yung Icey", link: "/producers/yung-icey" }
];

export default function ProducersPage() {
  const router = useRouter();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const [scope, animate] = useAnimate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const animatedRef = useRef(false); // Track if animation has run during this mount
  const { settings } = useSettings(); // Call useSettings

  // Lifted state for carousel index
  const initialIndex = useMemo(() => Math.floor(sampleProducers.length / 2), []);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Lifted handlers for carousel navigation
  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : sampleProducers.length - 1));
  };
  const handleNext = () => {
    setSelectedIndex((prev) => (prev < sampleProducers.length - 1 ? prev + 1 : 0));
  };

  const handleBack = () => {
    startTransition('/'); // Trigger transition back to home
  };

  // Handle entry animation on mount
  useEffect(() => {
    // Reset animation state
    animatedRef.current = false;
    setAnimationComplete(false);
    
    const runEntryAnimation = async () => {
      // Skip if already animated during this mount
      if (animatedRef.current) return;
      animatedRef.current = true;
      
      // Ensure elements are hidden IMMEDIATELY on mount
      animate([
        [".cyberpunk-title", { opacity: 0, y: -100 }, { duration: 0 }],
        [".carousel-container", { opacity: 0, scale: 0.8 }, { duration: 0 }],
        [".back-button-container", { opacity: 0, x: -50 }, { duration: 0 }],
        [".nav-arrow-container", { opacity: 0, y: 50 }, { duration: 0 }],
        [".matrix-background", { opacity: 0 }, { duration: 0 }]
      ], { immediate: true }); // Force immediate application
      
      // Short delay before starting animations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Animate all elements simultaneously with the same duration
      await Promise.all([
        animate(".cyberpunk-title", { opacity: 1, y: 0 }, { duration: 0.7, ease: "easeOut" }),
        animate(".carousel-container", { opacity: 1, scale: 1 }, { duration: 0.7, ease: "easeOut" }),
        animate(".nav-arrow-container", { opacity: 1, y: 0 }, { duration: 0.7, ease: "easeOut" }),
        animate(".back-button-container", { opacity: 1, x: 0 }, { duration: 0.7, ease: "easeOut" }),
        animate(".matrix-background", { opacity: 0.4 }, { duration: 0.7, ease: "easeOut" })
      ]);
      
      setAnimationComplete(true);
    };
    
    runEntryAnimation();
    
    // Cleanup function to handle unmounting
    return () => {
      animatedRef.current = false;
    };
  }, [animate]); // Keep dependency on animate

  // Handle exit animation
  useEffect(() => {
    const runExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute) {
        // Animate elements out in reverse sequence
        await Promise.all([
          animate(".cyberpunk-title", { opacity: 0, y: -50 }, { duration: 0.4, ease: 'easeIn' }),
          animate(".carousel-container", { opacity: 0, scale: 0.9 }, { duration: 0.5, ease: 'easeIn' }),
          animate(".back-button-container", { opacity: 0, x: -30 }, { duration: 0.3, ease: 'easeIn' }),
          animate(".nav-arrow-container", { opacity: 0, y: 30 }, { duration: 0.3, ease: 'easeIn' }),
          animate(".matrix-background", { opacity: 0 }, { duration: 0.6, ease: 'easeIn' }) // Fade out background
        ]);

        // Navigate after animations
        router.push(nextRoute);
        completeTransition();
      }
    };
    runExitAnimation();
  }, [transitionState, nextRoute, animate, completeTransition, router]);

  return (
    <div 
      ref={scope} 
      className="relative h-screen w-full flex flex-col overflow-hidden uses-page-colors" // Add uses-page-colors
      style={{
        '--page-primary-color': settings.colors.primary,
        '--page-secondary-color': settings.colors.secondary,
        '--page-background-color': settings.colors.background,
      } as React.CSSProperties} // Set CSS Variables
    >
      {/* Background with Tilt */}
      <Tilt
        tiltMaxAngleX={1} 
        tiltMaxAngleY={1}
        perspective={4000}
        transitionSpeed={1500}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor={settings.colors.primary} // Use primary for glare
        glarePosition="all"
        className="absolute inset-0 z-[-1] matrix-background-container" // Added class for targeting
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="absolute inset-0 matrix-background" // Added class for targeting
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, ease: "easeIn" }}
        >
          <MatrixBackground2 />
        </motion.div>
      </Tilt>
      
      {/* Content Area with Tilt - Adjust pt to account for header */}
      <Tilt
        tiltMaxAngleX={15} // Slightly less tilt than homepage content?
        tiltMaxAngleY={15}
        perspective={2000}
        transitionSpeed={1000}
        trackOnWindow={true}
        glareEnable={false} // Maybe no glare on content
        // Apply flex layout AND relative positioning
        className="relative flex-grow flex flex-col items-center justify-center w-full px-4 z-10 pt-36 pb-32" 
        style={{ transformStyle: 'preserve-3d' }}
      >
          {/* Back Button - MOVED INSIDE Tilt - Adjusted spacing further */}
          <div className="back-button-container absolute top-8 left-12 z-50 mb-6"> {/* Increased left further */}
            <CyberpunkButton 
              text="BACK"
              margin="m-0" 
              index={99} 
              onClick={handleBack}
              primaryColor={settings.colors.primary} // Pass primary color
              secondaryColor={settings.colors.secondary} // Pass secondary color
            />
          </div>

          {/* Page Title - Add className */}
          <motion.div 
            className="page-title text-center mb-8 cyberpunk-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : -50 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.3 
            }}
          >
            <div className="cyberpunk-title relative">
              <div className="glitch-container">
                <h1 className="text-5xl font-bold glitch-text" data-text="Choose Your Producer">Choose Your Producer</h1>
              </div>
              <div className="title-decoration">
                <div className="scan-line"></div>
                <div className="corner-decoration top-left"></div>
                <div className="corner-decoration top-right"></div>
                <div className="corner-decoration bottom-left"></div>
                <div className="corner-decoration bottom-right"></div>
                <div className="title-data-text" style={{ color: settings.colors.primary }}>SYS://PRODUCER_SELECT.EXE</div>
              </div>
            </div>
          </motion.div>
          
          {/* Producer Carousel Wrapper - Set to ignore pointer events */}
          <div className="carousel-container w-full pointer-events-none"> 
            <ProducerCarousel 
              selectedIndex={selectedIndex} 
              producersData={sampleProducers} 
            />
          </div>

          {/* Carousel Navigation Arrows - Set CSS variables on the container */}
          <div 
            className="nav-arrow-container fixed bottom-24 left-0 right-0 mx-auto w-fit flex space-x-12 z-[60]"
            style={{
              '--csb-primary': settings.colors.primary,
              '--csb-secondary': settings.colors.secondary,
            } as React.CSSProperties}
          >
            <CyberSquareButton
              text="<"
              onClick={handlePrev}
              size="60px"
              className="nav-prev-button"
            />
            <CyberSquareButton
              text=">"
              onClick={handleNext}
              size="60px"
              className="nav-next-button"
            />
          </div>
      </Tilt>
    </div>
  );
} 
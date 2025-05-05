'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { LargeMusicPlayer } from '@/components/music/LargeMusicPlayer';
import { MatrixBackground } from '@/components/layout/MatrixBackground4';
import { CyberpunkButton } from '@/components/ui/CyberpunkButton';
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { motion, useAnimate } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function MusicPage() {
  const { activateLargeView, deactivateLargeView } = useMusicPlayer();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const router = useRouter();
  const [scope, animate] = useAnimate();

  // Handle activation of large view
  useEffect(() => {
    const activationTimeout = setTimeout(() => {
      activateLargeView();
    }, 50);

    return () => {
      clearTimeout(activationTimeout);
      deactivateLargeView();
    };
  }, [activateLargeView, deactivateLargeView]);

  // Handle entry animation
  useEffect(() => {
    console.log("MusicPage: Entry animation useEffect running.");
    
    const runEntryAnimation = async () => {
      console.log("MusicPage: runEntryAnimation started.");
      // Check if scope is available
      if (!scope.current) {
        console.error("MusicPage: Animation scope is not available!");
        return;
      }
      console.log("MusicPage: Animation scope found:", scope.current);
      
      // Start elements hidden
      console.log("MusicPage: Setting initial animation states (hidden).");
      animate([
        [".background-container", { opacity: 0 }, { duration: 0 }],
        [".music-player-wrapper", { opacity: 0, scale: 0.8 }, { duration: 0 }],
        [".back-button-container", { opacity: 0, x: -50 }, { duration: 0 }]
      ], { immediate: true });

      // Use a small delay to ensure initial state applies before animating in
      await new Promise(resolve => setTimeout(resolve, 50)); 

      console.log("MusicPage: Starting sequenced entry animations.");
      // Animate elements in sequence for a cooler effect
      await animate(".background-container", { opacity: 0.7 }, { duration: 0.6, ease: "easeOut" });
      console.log("MusicPage: Background animated.");
      await animate(".music-player-wrapper", { opacity: 1, scale: 1 }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
      console.log("MusicPage: Music player animated.");
      await animate(".back-button-container", { opacity: 1, x: 0 }, { duration: 0.5, ease: "easeOut" });
      console.log("MusicPage: Back button animated. Entry animation complete.");
    };

    runEntryAnimation();
    
    // No cleanup needed for animatedRef anymore

  // Empty dependency array ensures this runs once on mount
  }, [animate, scope]);

  // Handle exit animation
  useEffect(() => {
    const runExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute) {
        console.log("MusicPage: Exit animation started.");
        await Promise.all([
          animate(".music-player-wrapper", { opacity: 0, scale: 0.9 }, { duration: 0.4, ease: 'easeIn' }),
          animate(".back-button-container", { opacity: 0, x: -20 }, { duration: 0.3, ease: 'easeIn' }),
          animate(".background-container", { opacity: 0 }, { duration: 0.5, ease: 'easeIn' })
        ]);
        console.log("MusicPage: Exit animation complete. Navigating...");
        router.push(nextRoute);
        completeTransition();
      }
    };
    runExitAnimation();
  }, [transitionState, nextRoute, animate, completeTransition, router]);

  const handleBack = () => {
    startTransition('/');
  };

  return (
    <motion.div
      ref={scope}
      className="relative min-h-screen w-full flex items-center justify-center p-4"
    >
      {/* Matrix background with Tilt effect */}
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1500}
        scale={1}
        transitionSpeed={2000}
        gyroscope={true}
        className="fixed inset-0 z-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="background-container w-full h-full">
      <MatrixBackground />
        </div>
      </Tilt>
      
      {/* Back button */}
      <div className="absolute top-8 left-12 z-50 back-button-container">
        <CyberpunkButton 
            text="BACK"
            margin="m-0"
            index={99}
            onClick={handleBack}
          />
      </div>
      
      {/* Music player with Tilt effect */}
      <Tilt
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        perspective={1000}
        scale={1.02}
        transitionSpeed={1500}
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#39FF14"
        glarePosition="all"
        className="music-player-wrapper relative z-10 mt-12 min-w-[300px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <LargeMusicPlayer />
      </Tilt>
    </motion.div>
  );
} 
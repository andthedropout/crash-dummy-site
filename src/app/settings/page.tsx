'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimate } from 'framer-motion';
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { CyberpunkButton } from '@/components/ui/CyberpunkButton';
import { MatrixBackground } from '@/components/layout/MatrixBackground';

export default function SettingsPage() {
  const router = useRouter();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const [scope, animate] = useAnimate();
  const animatedRef = useRef(false);
  
  // Handle back navigation
  const handleBack = () => {
    startTransition('/');
  };

  // Handle entry animation
  useEffect(() => {
    // Reset animation state
    animatedRef.current = false;
    
    const runEntryAnimation = async () => {
      // Skip if already animated during this mount
      if (animatedRef.current) return;
      animatedRef.current = true;
      
      // Start elements hidden
      animate([
        [".page-title", { opacity: 0, y: -100 }, { duration: 0 }],
        [".settings-container", { opacity: 0, scale: 0.9 }, { duration: 0 }],
        [".back-button-container", { opacity: 0, x: -50 }, { duration: 0 }],
        [".matrix-background", { opacity: 0 }, { duration: 0 }]
      ], { immediate: true });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Animate all elements simultaneously
      await Promise.all([
        animate(".matrix-background", { opacity: 0.4 }, { duration: 0.7, ease: "easeOut" }),
        animate(".page-title", { opacity: 1, y: 0 }, { duration: 0.7, ease: "easeOut" }),
        animate(".settings-container", { opacity: 1, scale: 1 }, { duration: 0.7, ease: "easeOut" }),
        animate(".back-button-container", { opacity: 1, x: 0 }, { duration: 0.7, ease: "easeOut" })
      ]);
    };

    runEntryAnimation();
    
    // Cleanup
    return () => {
      animatedRef.current = false;
    };
  }, [animate]);

  // Handle exit animation
  useEffect(() => {
    const runExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute) {
        await Promise.all([
          animate(".page-title", { opacity: 0, y: -50 }, { duration: 0.4, ease: 'easeIn' }),
          animate(".settings-container", { opacity: 0, scale: 0.9 }, { duration: 0.5, ease: 'easeIn' }),
          animate(".back-button-container", { opacity: 0, x: -30 }, { duration: 0.3, ease: 'easeIn' }),
          animate(".matrix-background", { opacity: 0 }, { duration: 0.6, ease: 'easeIn' })
        ]);

        router.push(nextRoute);
        completeTransition();
      }
    };
    runExitAnimation();
  }, [transitionState, nextRoute, animate, completeTransition, router]);

  return (
    <motion.div 
      ref={scope}
      className="relative min-h-screen w-full flex flex-col items-center text-white p-4 pt-24 pb-12 overflow-y-auto"
    >
      {/* Background */}
      <div className="fixed inset-0 z-[-1] matrix-background">
        <MatrixBackground />
      </div>
      
      {/* Back Button */}
      <div className="absolute top-8 left-12 z-50 back-button-container">
        <CyberpunkButton 
          text="BACK"
          margin="m-0"
          index={99}
          onClick={handleBack}
        />
      </div>

      {/* Page Title */}
      <div className="page-title text-center mb-12">
        <div className="cyberpunk-title relative">
          <div className="glitch-container">
            <h1 className="text-5xl font-bold text-lime-300 glitch-text" data-text="Settings">Settings</h1>
          </div>
          <div className="title-decoration">
            <div className="scan-line"></div>
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>
            <div className="title-data-text">SYS://SETTINGS.EXE</div>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div className="settings-container w-full max-w-4xl bg-neutral-900/70 border border-lime-500/30 p-6 rounded-md backdrop-blur-sm shadow-md">
        <h2 className="text-2xl font-semibold text-lime-400 mb-4 font-mono">Settings</h2>
        <p className="text-neutral-300">Settings content will be added later.</p>
      </div>
    </motion.div>
  );
} 
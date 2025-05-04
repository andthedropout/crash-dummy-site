'use client'; // Mark this component as a Client Component

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimate, stagger } from "framer-motion";
import { MatrixBackground } from "@/components/layout/MatrixBackground"; // Restore this import
import { CyberpunkButtons } from "@/components/ui/CyberpunkButtons"; // Use named import
import Tilt from 'react-parallax-tilt'; // Import the tilt component
import { usePageTransition } from "@/components/layout/PageTransitionContext";
import Image from "next/image"; // Import next/image

// // import { Header } from "@/components/layout/header";
// // import { Hero } from "@/components/layout/hero";

export default function Home() {
  const router = useRouter();
  const { transitionState, nextRoute, completeTransition } = usePageTransition();
  const [scope, animate] = useAnimate();
  const backgroundRef = useRef(null);
  const gifRef = useRef(null);

  // Handle navigation and sequenced animation effects
  useEffect(() => {
    const handleExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute && scope.current && gifRef.current && backgroundRef.current) {
        // 1. Animate buttons (staggered) - enhanced with classic video game style
        animate(".sci-fi-button", 
          { 
            x: 600, 
            y: [0, -30, 20], // Slight up and down movement
            scale: [1, 1.15, 1], // Slight pulse as it exits
            rotateZ: [0, -5, 2], // Slight rotation for dynamic movement
            opacity: [1, 1, 0] // Maintain opacity longer before fading
          }, 
          { 
            duration: 0.75, // Slightly longer duration
            delay: stagger(0.09), // Slightly more delay between buttons
            ease: "anticipate", // Classic game-like easing
            times: [0, 0.6, 1] // Control timing of multi-keyframe properties
          }
        );

        // Wait for button animations (further shortened)
        await new Promise(resolve => setTimeout(resolve, 250)); // Reduced wait time further

        // 2. Animate GIF fade and move
        await animate(gifRef.current, 
          { opacity: 0, x: -100 }, 
          { duration: 0.5, ease: "easeOut" }
        );

        // 3. Animate Background fade
        await animate(backgroundRef.current, 
          { opacity: 0 }, 
          { duration: 0.5, ease: "easeOut" }
        );

        // 4. Navigate after all animations
        router.push(nextRoute);
        completeTransition();
      }
    };

    handleExitAnimation();

  }, [transitionState, nextRoute, router, completeTransition, animate, scope]); // Add scope to dependency array

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start pb-16 text-white overflow-hidden">
      {/* Restore the Tilt wrapper for MatrixBackground */}
      <Tilt
        tiltMaxAngleX={5} 
        tiltMaxAngleY={5}
        perspective={1000}
        trackOnWindow={true}
        transitionSpeed={2000} 
        glareEnable={true}
        glareMaxOpacity={0.5}
        glareColor="#39FF14"
        glarePosition="all"
        glareBorderRadius="8px"
        className="absolute inset-0 z-[-2]" // Position fixed-like behind everything
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background container with ref and fade-in animation */}
        <motion.div 
          ref={backgroundRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <MatrixBackground />
        </motion.div>
      </Tilt> 

      {/* Global Glow Layer - Temporarily Commented Out */}
      {/* <div
        className="pointer-events-none fixed inset-0 z-[-1] shadow-[0_0_100px_50px_rgba(57,255,20,0.5)]"
      /> */}
      {/* Black overlay with radial fade - Restored */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_black_0%,_rgba(0,0,0,0)_195%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Wrap the content container with Tilt */}
      <Tilt
        tiltMaxAngleX={30}
        tiltMaxAngleY={30}
        perspective={5000} // Keep perspective here for the Tilt effect
        transitionSpeed={2000}
        trackOnWindow={true}
        scale={1} // No scale
        glareEnable={false}
        className="relative z-10 flex w-full max-w-6xl flex-grow items-stretch p-8"
        style={{ transformStyle: 'preserve-3d' }} // Keep transformStyle for Tilt
      >
        {/* Left Column: GIF with ref and fade-in animation */}
        <motion.div 
          ref={gifRef}
          className="relative flex w-2/3 items-center justify-center p-0 pointer-events-none" // Added relative positioning
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          {/* Use next/image with layout="fill" */}
          <Image
            className="rounded-lg object-cover relative -top-8 shadow-lg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)] pointer-events-none"
            src="/logo-matrix-unscreen.gif" 
            alt="Matrix Logo Animation"
            layout="fill" // Fill the parent container
            objectFit="cover" // Maintain aspect ratio, covering the area
            unoptimized // Keep GIF as is
          />
        </motion.div>

        {/* Right Column: CyberpunkButtons with ref for animation scope */}
        <motion.div 
          ref={scope} // Use the scope ref here for button animation targeting
          className="w-1/3 flex items-center justify-end relative z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CyberpunkButtons />
        </motion.div>
      </Tilt>
      {/* <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '50vh', zIndex: 1 }}> */}
      {/* */}
      {/* </h1> */}
    </main>
  );
}

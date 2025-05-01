'use client'; // Mark this component as a Client Component

import { MatrixBackground } from "@/components/layout/MatrixBackground";
import { CyberpunkButtons } from "@/components/ui/CyberpunkButtons"; // Use named import
import Tilt from 'react-parallax-tilt'; // Import the tilt component

// // import { Header } from "@/components/layout/header";
// // import { Hero } from "@/components/layout/hero";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start pb-16 text-white overflow-hidden">
      {/* Wrap MatrixBackground in its own Tilt */}
      <Tilt
        tiltMaxAngleX={5} // Subtle tilt for background
        tiltMaxAngleY={5}
        perspective={1000}
        trackOnWindow={true}
        transitionSpeed={2000} // Slower transition for background
        glareEnable={true}
        glareMaxOpacity={0.5}
        glareColor="#39FF14"
        glarePosition="all"
        glareBorderRadius="8px"
        className="absolute inset-0 z-[-2]" // Position fixed-like behind everything
        style={{ transformStyle: 'preserve-3d' }}
      >
        <MatrixBackground />
      </Tilt>

      {/* Global Glow Layer - Temporarily Commented Out */}
      {/* <div
        className="pointer-events-none fixed inset-0 z-[-1] shadow-[0_0_100px_50px_rgba(57,255,20,0.5)]"
      /> */}
      {/* Black overlay with radial fade - Restored */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_black_0%,_rgba(0,0,0,0)_195%)]"
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
        {/* Left Column: GIF */}
        <div className="flex w-2/3 items-center justify-center p-0 pointer-events-none">
          <img
            // Maintained same styling but switched from video to image
            className="w-full rounded-lg object-cover relative -top-8 shadow-lg [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)] pointer-events-none"
            src="/logo-matrix-unscreen.gif" 
            alt="Matrix Logo Animation"
          />
        </div>

        {/* Right Column: Use the CyberpunkButtons component - Add higher z-index */}
        <div className="w-1/3 flex items-center justify-end relative z-50"> {/* Add relative and higher z-index */} 
          <CyberpunkButtons />
        </div>
      </Tilt>
      {/* <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '50vh', zIndex: 1 }}> */}
      {/* */}
      {/* </h1> */}
    </main>
  );
}

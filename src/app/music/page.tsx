'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { LargeMusicPlayer } from '@/components/music/LargeMusicPlayer';
import { MatrixBackground } from '@/components/layout/MatrixBackground4';
import { CyberpunkButton } from '@/components/ui/CyberpunkButton';
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { motion, useAnimate } from 'framer-motion';

export default function MusicPage() {
  const { activateLargeView, deactivateLargeView } = useMusicPlayer();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const router = useRouter();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const activationTimeout = setTimeout(() => {
      activateLargeView();
    }, 50);

    return () => {
      clearTimeout(activationTimeout);
      deactivateLargeView();
    };
  }, [activateLargeView, deactivateLargeView]);

  useEffect(() => {
    const runExitAnimation = async () => {
      if (transitionState === 'exiting' && nextRoute) {
        await Promise.all([
          animate(".music-player-wrapper", { opacity: 0, scale: 0.9 }, { duration: 0.4, ease: 'easeIn' }),
          animate(".back-button-container", { opacity: 0, x: -20 }, { duration: 0.3, ease: 'easeIn' })
        ]);

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
      <MatrixBackground />
      <div className="absolute top-8 left-12 z-50 back-button-container">
        <CyberpunkButton 
            text="BACK"
            margin="m-0"
            index={99}
            onClick={handleBack}
          />
      </div>
      <div className="music-player-wrapper">
        <LargeMusicPlayer />
      </div>
    </motion.div>
  );
} 
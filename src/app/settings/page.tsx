'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimate } from 'framer-motion';
import { usePageTransition } from '@/components/layout/PageTransitionContext';
import { CyberpunkButton } from '@/components/ui/CyberpunkButton';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { useSettings } from '@/context/SettingsContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const router = useRouter();
  const { transitionState, nextRoute, startTransition, completeTransition } = usePageTransition();
  const [scope, animate] = useAnimate();
  const animatedRef = useRef(false);
  
  // Get settings from context
  const { settings, updateSoundReactivity, updateColors, resetToDefaults } = useSettings();
  
  // Memoize callbacks to prevent infinite updates
  const handleToggleSoundReactivity = useCallback((checked: boolean) => {
    updateSoundReactivity({ enabled: checked });
  }, [updateSoundReactivity]);
  
  const handleIntensityChange = useCallback((value: number[]) => {
    updateSoundReactivity({ intensity: value[0] });
  }, [updateSoundReactivity]);
  
  const handlePrimaryColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateColors({ primary: e.target.value });
  }, [updateColors]);
  
  const handleSecondaryColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateColors({ secondary: e.target.value });
  }, [updateColors]);
  
  const handleBackgroundColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateColors({ background: e.target.value });
  }, [updateColors]);
  
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
      style={{
        '--page-primary-color': settings.colors.primary,
        '--page-secondary-color': settings.colors.secondary,
        '--page-background-color': settings.colors.background
      } as React.CSSProperties}
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
          primaryColor={settings.colors.primary}
          secondaryColor={settings.colors.secondary}
        />
      </div>

      {/* Page Title */}
      <div className="page-title text-center mb-12">
        <div className="cyberpunk-title relative uses-page-colors">
          <div className="glitch-container">
            <h1 
              className="text-5xl font-bold glitch-text"
              style={{
                color: settings.colors.secondary,
                textShadow: `0 0 5px ${settings.colors.primary}, 0 0 10px ${settings.colors.primary}`
              }}
              data-text="Settings"
            >
              Settings
            </h1>
          </div>
          <div className="title-decoration">
            <div className="scan-line"></div>
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration top-right"></div>
            <div className="corner-decoration bottom-left"></div>
            <div className="corner-decoration bottom-right"></div>
            <div 
              className="title-data-text" 
              style={{
                color: settings.colors.primary,
                textShadow: 'none'
              }}
            >
              SYS://SETTINGS.EXE
            </div>
          </div>
        </div>
      </div>

      {/* Settings Container */}
      <div 
        className="settings-container w-full max-w-2xl bg-neutral-900/70 border p-6 rounded-md backdrop-blur-sm shadow-md"
        style={{ borderColor: `${settings.colors.secondary}4D` }}
      >
        <div className="space-y-6">
          {/* Sound Reactivity Toggle */}
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="sound-enabled" 
              className="text-lg"
              style={{ color: settings.colors.secondary }}
            >
              Sound Reactivity
            </Label>
            <Switch 
              id="sound-enabled"
              checked={settings.soundReactivity.enabled}
              onCheckedChange={handleToggleSoundReactivity}
              style={{ '--switch-checked-color': settings.colors.primary } as React.CSSProperties}
              className="data-[state=checked]:bg-[var(--switch-checked-color)]"
            />
          </div>
          
          {/* Sound Reactivity Intensity */}
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="sound-intensity" 
              className="text-lg"
              style={{ color: settings.colors.secondary }}
            >
              Reactivity Intensity
            </Label>
            <div 
              className="flex items-center gap-4 w-1/2"
              style={{
                '--slider-range-color': settings.colors.primary,
                '--slider-focus-color': settings.colors.primary
              } as React.CSSProperties}
            >
              <Slider
                id="sound-intensity"
                disabled={!settings.soundReactivity.enabled}
                min={0}
                max={1}
                step={0.01}
                value={[settings.soundReactivity.intensity]}
                onValueChange={handleIntensityChange}
                className="w-full"
              />
              <span 
                className="w-16 text-right"
                style={{ color: settings.colors.primary }}
              >
                {Math.round(settings.soundReactivity.intensity * 100)}%
              </span>
            </div>
          </div>
          
          {/* Primary Color */}
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="primary-color" 
              className="text-lg"
              style={{ color: settings.colors.secondary }}
            >
              Primary Color
            </Label>
            <div className="flex items-center gap-4 w-1/2 justify-end">
              <div 
                className="w-10 h-10 rounded border border-white/20"
                style={{
                  backgroundColor: settings.colors.primary,
                }}
              ></div>
              <input 
                type="color" 
                id="primary-color"
                value={settings.colors.primary}
                onChange={handlePrimaryColorChange}
                className="w-24 h-8 bg-neutral-800 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="secondary-color" 
              className="text-lg"
              style={{ color: settings.colors.secondary }}
            >
              Secondary Color
            </Label>
            <div className="flex items-center gap-4 w-1/2 justify-end">
              <div 
                className="w-10 h-10 rounded border border-white/20"
                style={{
                  backgroundColor: settings.colors.secondary,
                }}
              ></div>
              <input 
                type="color" 
                id="secondary-color"
                value={settings.colors.secondary}
                onChange={handleSecondaryColorChange} 
                className="w-24 h-8 bg-neutral-800 rounded cursor-pointer"
              />
            </div>
          </div>
          
          {/* Background Color */}
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="background-color" 
              className="text-lg"
              style={{ color: settings.colors.secondary }}
            >
              Background Color
            </Label>
             <div className="flex items-center gap-4 w-1/2 justify-end">
              <div 
                className="w-10 h-10 rounded border border-white/20"
                style={{
                  backgroundColor: settings.colors.background,
                }}
              ></div>
              <input 
                type="color" 
                id="background-color"
                value={settings.colors.background}
                onChange={handleBackgroundColorChange}
                className="w-24 h-8 bg-neutral-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        <div className="flex justify-end mt-10 border-t border-lime-500/30 pt-6">
          <CyberpunkButton 
            text="RESET TO DEFAULTS"
            margin="m-0"
            index={99}
            onClick={resetToDefaults}
            primaryColor={settings.colors.primary}
            secondaryColor={settings.colors.secondary}
          />
        </div>
      </div>
    </motion.div>
  );
} 
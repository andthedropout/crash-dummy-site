'use client';

import React, { useState } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { useSettings } from '@/context/SettingsContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
// Removed CyberpunkButton import
// import { CyberpunkButton } from '@/components/ui/CyberpunkButton';

// Simple placeholder icons
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>;
// Add volume icons
const VolumeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>;
const MuteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>;

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const GlobalMusicPlayer: React.FC = () => {
  const { isPlaying, currentTrack, togglePlayPause, isLargeViewActive, volume, setVolume } = useMusicPlayer();
  const { settings } = useSettings();
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const primaryColor = settings.colors.primary;

  const handleTogglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    togglePlayPause();
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowVolumeControl(prev => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  // Prevent volume slider from hiding when adjusting
  const handleVolumeSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Define dynamic styles based on primaryColor
  const buttonStyle: React.CSSProperties = {
    backgroundColor: hexToRgba(primaryColor, 0.25),
    borderColor: hexToRgba(primaryColor, 0.35),
    color: primaryColor,
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: hexToRgba(primaryColor, 0.4),
    borderColor: hexToRgba(primaryColor, 0.8)
  };

  const sliderStyle: React.CSSProperties = {
    accentColor: primaryColor,
  };

  return (
    <motion.div 
      layoutId="music-player-container" 
      className="fixed top-4 right-4 z-[100] bg-black/80 backdrop-blur-sm rounded-sm p-3 font-mono flex items-center space-x-3 shadow-md cursor-pointer border"
      style={{
        borderColor: settings.colors.secondary,
        color: primaryColor,
        boxShadow: `0 0 8px ${hexToRgba(primaryColor, 0.1)}`
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isLargeViewActive && (
        <>
          <button 
            onClick={handleTogglePlayPause}
            className="w-7 h-7 flex items-center justify-center rounded-sm border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-black/50 z-10"
            style={buttonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />} 
          </button>

          <Link href="/music" className="flex-grow overflow-hidden whitespace-nowrap" legacyBehavior={false}>
            {currentTrack ? (
              <div>
                <p className="font-medium truncate tracking-wide" style={{ color: hexToRgba(primaryColor, 0.9) }}>{currentTrack.title}</p>
                <p className="text-xs truncate" style={{ color: hexToRgba(primaryColor, 0.7) }}>{currentTrack.artist}</p>
              </div>
            ) : (
              <p className="italic" style={{ color: hexToRgba(primaryColor, 0.6) }}>No track loaded</p>
            )}
          </Link>
          
          {/* Volume control button */}
          <div className="relative">
            <button 
              onClick={handleVolumeClick}
              className="w-7 h-7 flex items-center justify-center rounded-sm border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-black/50 z-10"
              style={buttonStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
              aria-label="Volume control"
            >
              {volume > 0 ? <VolumeIcon /> : <MuteIcon />}
            </button>
            
            {/* Volume slider popup */}
            {showVolumeControl && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-black/90 border rounded-sm shadow-lg z-20"
                style={{ borderColor: hexToRgba(primaryColor, 0.35) }}
                onMouseDown={handleVolumeSliderMouseDown}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 appearance-none rounded-full overflow-hidden"
                  style={sliderStyle}
                />
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}; 
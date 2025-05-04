'use client';

import React from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { motion } from 'framer-motion';
// Removed CyberpunkButton import
// import { CyberpunkButton } from '@/components/ui/CyberpunkButton';

// Simple placeholder icons
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="14" height="14"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>;

export const GlobalMusicPlayer: React.FC = () => {
  const { isPlaying, currentTrack, togglePlayPause, isLargeViewActive } = useMusicPlayer();

  return (
    <motion.div 
      layoutId="music-player-container" 
      className="fixed top-4 right-4 z-[100] bg-black/80 border border-lime-400/70 backdrop-blur-sm rounded-sm p-3 text-lime-300 font-mono flex items-center space-x-3 shadow-lime-500/10 shadow-md"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isLargeViewActive && (
        <>
          <button 
            onClick={togglePlayPause} 
            className="w-7 h-7 flex items-center justify-center rounded-sm bg-lime-900/50 hover:bg-lime-700/60 border border-lime-500/50 hover:border-lime-400 text-lime-300 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black/50"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />} 
          </button>

          <div className="text-sm overflow-hidden whitespace-nowrap">
            {currentTrack ? (
              <div>
                <p className="font-medium truncate text-lime-100 tracking-wide">{currentTrack.title}</p>
                <p className="text-xs text-lime-400/70 truncate">{currentTrack.artist}</p>
              </div>
            ) : (
              <p className="text-lime-400/60 italic">No track loaded</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}; 
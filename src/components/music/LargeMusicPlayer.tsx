'use client';

import React from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { motion } from 'framer-motion';

// Placeholder icons (replace later with actual icons/components)
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="24" height="24"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="24" height="24"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>;
const SkipBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="20" height="20"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L6.267 4.99a.5.5 0 0 0-.767.41v6.1a.5.5 0 0 0 .767.41L11.5 8.753V12a.5.5 0 0 0 1 0V4zM4 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 4 4z"/></svg>;
const SkipForwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="20" height="20"><path d="M3.5 4a.5.5 0 0 1 1 0v3.248L9.733 4.99a.5.5 0 0 1 .767.41v6.1a.5.5 0 0 1-.767.41L4.5 8.753V12a.5.5 0 0 1-1 0V4zM12 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 12 4z"/></svg>;

export const LargeMusicPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlayPause, 
    isLargeViewActive,
    // Add future controls: playNext, playPrev, seek, setVolume 
  } = useMusicPlayer();

  return (
    // Wrap in motion.div with the same layoutId
    <motion.div
      layoutId="music-player-container"
      className="w-full max-w-md bg-black/80 border border-lime-400/70 backdrop-blur-md rounded-md p-6 text-lime-300 font-mono flex flex-col items-center space-y-4 shadow-xl shadow-lime-900/20"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Example transition
    >
      {/* Only render content if large view IS active */}
      {isLargeViewActive && (
        <>
          {/* Track Info (Larger) */}
          <div className="text-center">
            {currentTrack ? (
              <>
                <p className="text-xl font-medium text-lime-100 tracking-wide truncate">{currentTrack.title}</p>
                <p className="text-sm text-lime-400/80 truncate">{currentTrack.artist}</p>
              </>
            ) : (
              <p className="text-lime-400/60 italic">No track loaded</p>
            )}
          </div>

          {/* Progress Bar Placeholder */}
          <div className="w-full h-1.5 bg-lime-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-lime-400"
              // style={{ width: `${progress}%` }} // TODO: Add progress state 
              style={{ width: `40%` }} // Placeholder width
            ></div>
          </div>

          {/* Controls (Larger Buttons) */}
          <div className="flex items-center justify-center space-x-6">
            <button 
              className="p-2 rounded-full text-lime-400/80 hover:text-lime-200 hover:bg-lime-800/40 transition-colors"
              // onClick={playPrev} // TODO: Add playPrev logic
              aria-label="Previous track"
            >
              <SkipBackIcon />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-lime-500/90 hover:bg-lime-400 text-black transition-colors focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black/80"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            <button 
              className="p-2 rounded-full text-lime-400/80 hover:text-lime-200 hover:bg-lime-800/40 transition-colors"
              // onClick={playNext} // TODO: Add playNext logic
              aria-label="Next track"
            >
              <SkipForwardIcon />
            </button>
          </div>

          {/* Volume Control Placeholder */}
          {/* ... */}
        </>
      )}
    </motion.div>
  );
}; 
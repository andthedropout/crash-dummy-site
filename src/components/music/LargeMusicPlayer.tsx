'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/context/MusicPlayerContext';
import { motion } from 'framer-motion';

// Placeholder icons (replace later with actual icons/components)
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="24" height="24"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="24" height="24"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>;
const VolumeHighIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/><path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>;
const VolumeMuteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>;

export const LargeMusicPlayer: React.FC = () => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlayPause, 
    isLargeViewActive,
    audioRef,
    volume,
    setVolume
  } = useMusicPlayer();

  // State for tracking playback progress
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Update progress as playback continues
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    // Set up event listeners for the audio element
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [audioRef]);

  // Handle click on progress bar for scrubbing
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;
    
    // Apply bounds check (0-100%)
    const boundedProgress = Math.max(0, Math.min(100, newProgress));
    
    // Update audio playback position
    if (audioRef.current.duration) {
      audioRef.current.currentTime = (boundedProgress / 100) * audioRef.current.duration;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (volume > 0) {
      // Store current volume before muting in a data attribute
      const volumeInput = document.getElementById('volume-slider') as HTMLInputElement;
      if (volumeInput) {
        volumeInput.dataset.lastVolume = volume.toString();
      }
      setVolume(0);
    } else {
      // Restore last volume or default to 80%
      const volumeInput = document.getElementById('volume-slider') as HTMLInputElement;
      const lastVolume = volumeInput?.dataset.lastVolume ? 
                          parseFloat(volumeInput.dataset.lastVolume) : 0.8;
      setVolume(lastVolume);
    }
  };

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    // Wrap in motion.div with the same layoutId
    <motion.div
      layoutId="music-player-container"
      className="w-full max-w-2xl bg-black/80 border border-lime-400/70 backdrop-blur-md rounded-md p-6 text-lime-300 font-mono flex flex-col items-center space-y-4 shadow-xl shadow-lime-900/20"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Only render content if large view IS active */}
      {isLargeViewActive && (
        <>
          {/* Track Info (Larger) */}
          <div className="text-center w-full">
            {currentTrack ? (
              <>
                <p className="text-xl font-medium text-lime-100 tracking-wide truncate">{currentTrack.title}</p>
                <p className="text-sm text-lime-400/80 truncate">{currentTrack.artist}</p>
              </>
            ) : (
              <p className="text-lime-400/60 italic">No track loaded</p>
            )}
          </div>

          {/* Progress Bar with Scrubbing */}
          <div className="w-full space-y-2">
            {/* Time display */}
            <div className="flex justify-between text-xs text-lime-400/70 w-full px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Clickable progress bar */}
            <div 
              ref={progressBarRef}
              className="w-full h-2 bg-lime-900/50 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressBarClick}
            >
            <div 
                className="h-full bg-lime-400 transition-all duration-100"
                style={{ width: `${progress}%` }}
            ></div>
            </div>
          </div>

          {/* Volume control section */}
          <div className="w-full flex items-center justify-center space-x-2 mb-2">
            <button 
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-sm bg-lime-900/50 hover:bg-lime-700/60 border border-lime-500/50 hover:border-lime-400 text-lime-300 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              {volume > 0 ? <VolumeHighIcon /> : <VolumeMuteIcon />}
            </button>
            
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 appearance-none bg-lime-900/70 rounded-full overflow-hidden accent-lime-500
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-lime-400
                        [&::-webkit-slider-thumb]:shadow-[-200px_0_0_200px_rgba(163,230,53,0.5)]"
            />
          </div>

          {/* Play/Pause Button (centered) */}
          <div className="flex items-center justify-center">
            <button 
              onClick={togglePlayPause} 
              className="w-12 h-12 flex items-center justify-center rounded-full bg-lime-500/90 hover:bg-lime-400 text-black transition-colors focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-black/80"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}; 
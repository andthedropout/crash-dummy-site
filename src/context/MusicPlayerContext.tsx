'use client';

import React, { createContext, useState, useContext, useRef, useCallback, ReactNode, useEffect } from 'react';

// Re-introduce Track interface
interface Track {
  title: string;
  artist: string;
  url: string;
}

interface MusicPlayerState {
  isPlaying: boolean;
  currentTrack: Track | null; // Change back to Track | null
  isLargeViewActive: boolean;
  audioVolume: number; // For visualization
  bassLevel: number; // For visualization
  midLevel: number; // For visualization
  highLevel: number; // For visualization
  volume: number; // For audio volume control
}

interface MusicPlayerContextProps extends MusicPlayerState {
  audioRef: React.RefObject<HTMLAudioElement>; 
  playTrack: (track: Track) => void; // Accept Track object
  togglePlayPause: () => void;
  activateLargeView: () => void;
  deactivateLargeView: () => void;
  setVolume: (value: number) => void; // New method to set volume
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

// Define the default track object
const defaultTrack: Track = {
  title: "United", // Or a more descriptive title
  artist: "Crash Dummy",
  url: "/songs_united.mp3"
};

// Define a type for window with potential webkitAudioContext
type WindowWithAudioContext = Window & typeof globalThis & { 
  webkitAudioContext?: typeof AudioContext 
};

// Linear interpolation function for smooth value transitions
const lerp = (start: number, end: number, factor: number): number => {
  return start * (1 - factor) + end * factor;
};

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentTrack: defaultTrack, // Initialize with default track object
    isLargeViewActive: false,
    audioVolume: 0,
    bassLevel: 0,
    midLevel: 0,
    highLevel: 0,
    volume: 0.8, // Default volume at 80%
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Add refs to store previous values for smoothing
  const prevVolumeRef = useRef<number>(0);
  const prevBassRef = useRef<number>(0);
  const prevMidRef = useRef<number>(0);
  const prevHighRef = useRef<number>(0);

  // Apply the volume setting to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const initializeAudioAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      // Use the specific window type here
      const context = new ((window as WindowWithAudioContext).AudioContext || (window as WindowWithAudioContext).webkitAudioContext)();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      const source = context.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.connect(context.destination);
      console.log("Audio Analyser Initialized");
    }
  }, []);

  const runAudioAnalysis = useCallback(() => {
    if (!analyserRef.current || !state.isPlaying) {
      // Smoothly animate down to zero instead of immediate reset
      const fadeSpeed = 0.1; // Adjust for faster/slower fade out
      const newVolume = lerp(prevVolumeRef.current, 0, fadeSpeed);
      const newBass = lerp(prevBassRef.current, 0, fadeSpeed);
      const newMid = lerp(prevMidRef.current, 0, fadeSpeed);
      const newHigh = lerp(prevHighRef.current, 0, fadeSpeed);
      
      // Only update if there's still a significant value
      if (Math.max(newVolume, newBass, newMid, newHigh) > 0.001) {
        setState(prevState => ({
          ...prevState,
          audioVolume: newVolume,
          bassLevel: newBass,
          midLevel: newMid,
          highLevel: newHigh
        }));
        
        // Update refs for next frame
        prevVolumeRef.current = newVolume;
        prevBassRef.current = newBass;
        prevMidRef.current = newMid;
        prevHighRef.current = newHigh;
        
        animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);
      } else {
        // Final reset when values are essentially zero
        setState(prevState => ({
          ...prevState,
          audioVolume: 0,
          bassLevel: 0,
          midLevel: 0,
          highLevel: 0
        }));
        
        prevVolumeRef.current = 0;
        prevBassRef.current = 0;
        prevMidRef.current = 0;
        prevHighRef.current = 0;
        
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Regular audio analysis when playing
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    
    // Time domain data for overall volume
    const timeDomainData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDomainData);
    
    // Frequency data for bass/mid/high
    const frequencyData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyData);

    // Calculate RMS (Root Mean Square) for volume
    let sumSquares = 0.0;
    for (let i = 0; i < bufferLength; i++) {
      const normSample = (timeDomainData[i] / 128.0) - 1.0;
      sumSquares += normSample * normSample;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);
    const instantVolume = Math.min(1, rms * 4.0);
    
    // Calculate frequency bands
    // Bass: ~20-250Hz, Mid: ~250-2000Hz, High: ~2000-20000Hz
    // These ranges are approximate and depend on the sample rate
    const bassEnd = Math.floor(bufferLength * 0.1);  // ~10% of the bins for bass
    const midEnd = Math.floor(bufferLength * 0.5);   // ~40% for mid
    
    let bassSum = 0, midSum = 0, highSum = 0;
    
    // Sum up energy in each frequency band
    for (let i = 0; i < bassEnd; i++) {
      bassSum += frequencyData[i];
    }
    for (let i = bassEnd; i < midEnd; i++) {
      midSum += frequencyData[i];
    }
    for (let i = midEnd; i < bufferLength; i++) {
      highSum += frequencyData[i];
    }
    
    // Normalize by number of bins in each range
    const instantBass = Math.min(1, (bassSum / bassEnd) / 256);
    const instantMid = Math.min(1, (midSum / (midEnd - bassEnd)) / 256);
    const instantHigh = Math.min(1, (highSum / (bufferLength - midEnd)) / 256);
    
    // Smooth transitions using LERP
    // Adjust smoothingFactor for more/less smoothing (0.05-0.2 is usually good)
    const smoothingFactor = 0.08;
    
    const smoothVolume = lerp(prevVolumeRef.current, instantVolume, smoothingFactor);
    const smoothBass = lerp(prevBassRef.current, instantBass, smoothingFactor);
    const smoothMid = lerp(prevMidRef.current, instantMid, smoothingFactor);
    const smoothHigh = lerp(prevHighRef.current, instantHigh, smoothingFactor);
    
    // Update state with smoothed values
    setState(prevState => ({
      ...prevState,
      audioVolume: smoothVolume,
      bassLevel: smoothBass,
      midLevel: smoothMid,
      highLevel: smoothHigh
    }));
    
    // Store current values for next frame
    prevVolumeRef.current = smoothVolume;
    prevBassRef.current = smoothBass;
    prevMidRef.current = smoothMid;
    prevHighRef.current = smoothHigh;

    animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);
  }, [state.isPlaying]);

  useEffect(() => {
    // Set initial source when component mounts and currentTrack exists
    if (audioRef.current && state.currentTrack && !audioRef.current.src) {
      audioRef.current.src = state.currentTrack.url;
      audioRef.current.volume = state.volume; // Set initial volume
    }
    
    if (state.isPlaying) {
      initializeAudioAnalyser();
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null; // Set to null
      }
      // Reset levels when paused is now handled in runAudioAnalysis with smooth fade out
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null; // Set to null on unmount/cleanup
      }
    };
  // Add state.currentTrack and state.volume to dependency array
  }, [state.isPlaying, state.currentTrack, state.volume, runAudioAnalysis, initializeAudioAnalyser]); 

  // Update playTrack to accept a Track object
  const playTrack = useCallback((track: Track) => { 
    if (audioRef.current) {
      audioRef.current.src = track.url; // Use track.url
      audioRef.current.volume = state.volume; // Set volume when changing tracks
      audioRef.current.load();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      initializeAudioAnalyser();
      audioRef.current.play()
        // Update state with the new track object
        .then(() => setState(prevState => ({ ...prevState, isPlaying: true, currentTrack: track })))
        .catch((error: unknown) => {
          console.error("Error playing track:", error);
        });
    }
  }, [initializeAudioAnalyser, state.volume]);

  const togglePlayPause = useCallback(() => {
    // Play default track if none is set (shouldn't happen with new init state, but safe)
    if (!audioRef.current || !state.currentTrack) { 
      playTrack(defaultTrack);
      return;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prevState => ({ ...prevState, isPlaying: false }));
    } else {
      audioRef.current.play()
        .then(() => setState(prevState => ({ ...prevState, isPlaying: true })))
        .catch((error: unknown) => {
          console.error("Error resuming playback:", error);
        });
    }
  }, [state.isPlaying, state.currentTrack, playTrack]);

  // Set volume function
  const setVolume = useCallback((value: number) => {
    // Ensure volume is between 0 and 1
    const newVolume = Math.max(0, Math.min(1, value));
    setState(prevState => ({ ...prevState, volume: newVolume }));
    
    // Apply volume to audio element immediately
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Effect to update audio element volume when state.volume changes externally
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // activate/deactivate LargeView remain the same
  const activateLargeView = useCallback(() => setState(prevState => ({ ...prevState, isLargeViewActive: true })), []);
  const deactivateLargeView = useCallback(() => setState(prevState => ({ ...prevState, isLargeViewActive: false })), []);

  return (
    <MusicPlayerContext.Provider value={{ 
      ...state,
      audioRef,
      playTrack, 
      togglePlayPause, 
      activateLargeView, 
      deactivateLargeView,
      setVolume
    }}>
      {children}
      {/* Remove src attribute here, it's set dynamically */}
      <audio ref={audioRef} loop={false} crossOrigin="anonymous" />
    </MusicPlayerContext.Provider>
  );
};

// useMusicPlayer hook remains the same
export const useMusicPlayer = (): MusicPlayerContextProps => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}; 
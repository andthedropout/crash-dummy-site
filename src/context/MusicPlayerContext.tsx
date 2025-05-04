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
}

interface MusicPlayerContextProps extends MusicPlayerState {
  audioRef: React.RefObject<HTMLAudioElement>; 
  playTrack: (track: Track) => void; // Accept Track object
  togglePlayPause: () => void;
  activateLargeView: () => void;
  deactivateLargeView: () => void;
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

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MusicPlayerState>({
    isPlaying: false,
    currentTrack: defaultTrack, // Initialize with default track object
    isLargeViewActive: false,
    audioVolume: 0,
    bassLevel: 0,
    midLevel: 0,
    highLevel: 0,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      setState(prevState => ({ ...prevState, audioVolume: 0, bassLevel: 0, midLevel: 0, highLevel: 0 })); // Reset all levels
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null; // Set to null
      return;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    let sumSquares = 0.0;
    for (let i = 0; i < bufferLength; i++) {
      const normSample = (dataArray[i] / 128.0) - 1.0;
      sumSquares += normSample * normSample;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);
    const volume = Math.min(1, rms * 4.0);
    setState(prevState => ({ ...prevState, audioVolume: volume }));

    animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);

  }, [state.isPlaying]);

  useEffect(() => {
    // Set initial source when component mounts and currentTrack exists
    if (audioRef.current && state.currentTrack && !audioRef.current.src) {
      audioRef.current.src = state.currentTrack.url;
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
      // Reset levels when paused
      setState(prevState => ({ ...prevState, audioVolume: 0, bassLevel: 0, midLevel: 0, highLevel: 0 }));
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null; // Set to null on unmount/cleanup
      }
    };
  // Add state.currentTrack to dependency array to set initial source
  }, [state.isPlaying, state.currentTrack, runAudioAnalysis, initializeAudioAnalyser]); 

  // Update playTrack to accept a Track object
  const playTrack = useCallback((track: Track) => { 
    if (audioRef.current) {
      audioRef.current.src = track.url; // Use track.url
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
  }, [initializeAudioAnalyser]);

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
      deactivateLargeView 
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
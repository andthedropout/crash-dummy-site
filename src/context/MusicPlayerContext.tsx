'use client';

import React, { createContext, useState, useContext, useRef, useCallback, ReactNode, useEffect } from 'react';

interface Track {
  title: string;
  artist: string;
  url: string;
}

interface MusicPlayerContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  isLargeViewActive: boolean;
  audioVolume: number;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  activateLargeView: () => void;
  deactivateLargeView: () => void;
  // Add more controls later (volume, progress, next, prev)
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// Placeholder track - Updated URL
const placeholderTrack: Track = {
  title: "Songs United Mix", // Update title?
  artist: "Crash Dummy", // Update artist?
  url: "/songs_united.mp3" // Use the actual file path
};

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLargeViewActive, setIsLargeViewActive] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const initializeAudioAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    if (!analyserRef.current || !isPlaying) {
      setAudioVolume(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
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
    setAudioVolume(volume);

    animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);

  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      initializeAudioAnalyser();
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(runAudioAnalysis);
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setAudioVolume(0);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, runAudioAnalysis, initializeAudioAnalyser]);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      initializeAudioAnalyser();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error: any) => console.error("Error playing track:", error));
    }
  }, [initializeAudioAnalyser]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) {
      playTrack(placeholderTrack);
      return;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error: any) => console.error("Error resuming track:", error));
    }
  }, [isPlaying, currentTrack, playTrack]);

  const activateLargeView = useCallback(() => setIsLargeViewActive(true), []);
  const deactivateLargeView = useCallback(() => setIsLargeViewActive(false), []);

  return (
    <MusicPlayerContext.Provider value={{ 
      isPlaying, 
      currentTrack, 
      isLargeViewActive, 
      audioVolume,
      playTrack, 
      togglePlayPause, 
      activateLargeView, 
      deactivateLargeView 
    }}>
      {children}
      <audio ref={audioRef} loop={false} crossOrigin="anonymous" />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): MusicPlayerContextType => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}; 
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of our settings
interface AppSettings {
  // Sound reactivity settings
  soundReactivity: {
    enabled: boolean; // Master toggle for sound reactivity
    intensity: number; // 0-1 scale for reactivity intensity
  };
  
  // Color settings
  colors: {
    primary: string;   // Primary matrix color (hex)
    secondary: string; // Secondary matrix color for effects (hex)
    background: string; // Background color (hex)
  };
}

// Define the shape of our context
interface SettingsContextProps {
  settings: AppSettings;
  updateSoundReactivity: (settings: Partial<AppSettings['soundReactivity']>) => void;
  updateColors: (colors: Partial<AppSettings['colors']>) => void;
  resetToDefaults: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  soundReactivity: {
    enabled: true,
    intensity: 0.7,
  },
  colors: {
    primary: '#39FF14',    // Neon Green (Restored default)
    secondary: '#90EE90', // Light Green
    background: '#000000', // Black
  },
};

// Create context
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with default settings ALWAYS first
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage only after initial mount on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          // Merge saved settings with defaults and set state directly
          const mergedSettings = { 
            ...defaultSettings, 
            ...parsedSettings,
            soundReactivity: { ...defaultSettings.soundReactivity, ...parsedSettings.soundReactivity },
            colors: { ...defaultSettings.colors, ...parsedSettings.colors }
          };
          setSettings(mergedSettings); // Set state directly, removing unused callback
        } catch (e) {
          console.error('Failed to parse saved settings:', e);
          // Use defaults if parsing fails
          setSettings(defaultSettings);
        }
      }
      setIsInitialized(true); // Mark as initialized
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Save settings to localStorage when they change, but only after initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    }
  }, [settings, isInitialized]);

  // Update sound reactivity settings
  const updateSoundReactivity = (newSettings: Partial<AppSettings['soundReactivity']>) => {
    setSettings(prev => ({
      ...prev,
      soundReactivity: {
        ...prev.soundReactivity,
        ...newSettings,
      },
    }));
  };

  // Update color settings
  const updateColors = (newColors: Partial<AppSettings['colors']>) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...newColors,
      },
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
        localStorage.removeItem('appSettings');
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSoundReactivity, 
      updateColors, 
      resetToDefaults 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 
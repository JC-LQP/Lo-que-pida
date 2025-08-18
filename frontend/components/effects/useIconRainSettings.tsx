'use client';

import { useState, useEffect } from 'react';

interface IconRainSettings {
  enabled: boolean;
  maxIcons: number;
  spawnInterval: number;
  iconSize: number;
  mouseIntensity: number;
  opacity: number;
  side: 'left' | 'right' | 'both';
  initialDensity: number;
}

const DEFAULT_SETTINGS: IconRainSettings = {
  enabled: true,
  maxIcons: 25,
  spawnInterval: 250,
  iconSize: 50,
  mouseIntensity: 0.3,
  opacity: 0.4,
  side: 'both',
  initialDensity: 6
};

const STORAGE_KEY = 'iconrain-settings';

export const useIconRainSettings = () => {
  const [settings, setSettings] = useState<IconRainSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar configuración desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.warn('Error loading IconRain settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar configuración en localStorage
  const updateSettings = (newSettings: Partial<IconRainSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.warn('Error saving IconRain settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Error resetting IconRain settings:', error);
    }
  };

  const toggleEnabled = () => {
    updateSettings({ enabled: !settings.enabled });
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    toggleEnabled,
    isLoaded
  };
};

'use client';

import React from 'react';
import IconRain from './IconRain';
import IconRainControls from './IconRainControls';
import { useIconRainSettings } from './useIconRainSettings';

export default function IconRainWrapper() {
  const { settings, isLoaded } = useIconRainSettings();

  // No renderizar hasta que los settings estén cargados
  if (!isLoaded) return null;

  return (
    <>
      {/* Efecto de iconos en segundo plano */}
      <IconRain
        enabled={settings.enabled}
        maxIcons={settings.maxIcons}
        spawnInterval={settings.spawnInterval}
        iconSize={settings.iconSize}
        mouseIntensity={settings.mouseIntensity}
        zIndex={1} // Por detrás del contenido principal
        opacity={settings.opacity}
        side={settings.side}
        initialDensity={settings.initialDensity}
      />
      
      {/* Controles flotantes */}
      <IconRainControls />
    </>
  );
}

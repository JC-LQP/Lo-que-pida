'use client';

import React, { useEffect, useState } from 'react';

const ECOMMERCE_ICONS = [
  'award.svg',
  'camera.svg',
  'clock.svg',
  'credit-card.svg',
  'dollar.svg',
  'gift.svg',
  'headphones.svg',
  'heart.svg',
  'laptop.svg',
  'package.svg',
  'percent.svg',
  'search.svg',
  'shield.svg',
  'shop.svg',
  'shopping-bag.svg',
  'shopping-cart.svg',
  'smartphone.svg',
  'star.svg',
  'tag.svg',
  'thumbs-up.svg',
  'truck.svg',
  'user.svg',
  'watch.svg',
];

interface IconRainProps {
  enabled?: boolean;
  intensity?: number; // 1-10 (cantidad de iconos)
  speed?: number; // 1-5 (velocidad de caída)
  size?: number; // tamaño en px
  opacity?: number; // 0-1
}

export default function IconRain({ 
  enabled = true, 
  intensity = 10, 
  speed = 1, 
  size = 32, 
  opacity = 0.6 
}: IconRainProps) {

  const createIcon = () => {
    const iconPath = ECOMMERCE_ICONS[Math.floor(Math.random() * ECOMMERCE_ICONS.length)];
    
    const img = document.createElement('img');
    img.src = `/icons/${iconPath}`;
    
    // Buscar Categories section y Footer para límites exactos
    const firstSection = document.querySelector('section');
    const footer = document.querySelector('footer');
    
    let startY = 300; // fallback
    let endY = window.innerHeight - 100; // fallback
    
    if (firstSection) {
      const rect = firstSection.getBoundingClientRect();
      startY = rect.top; // Borde superior de Categories
    }
    
    if (footer) {
      const rect = footer.getBoundingClientRect();
      endY = rect.top; // Borde superior del Footer
    }
    
    // Calcular distancia de caída
    const fallDistance = endY - startY;
    
    // Posición en laterales
    const isLeft = Math.random() > 0.5;
    const x = isLeft ? Math.random() * 120 : window.innerWidth - 120 + Math.random() * 120;
    
    // Colores aleatorios de la paleta
    const colors = ['#3C50E0', '#F23030', '#1C274C', '#606882'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Duración basada en velocidad
    const duration = (6 - speed) * 4000; // speed 1=5s, speed 5=1s
    
    img.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      opacity: ${opacity};
      z-index: 1;
      pointer-events: none;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      animation: fallDown-${Date.now()} ${duration}ms linear forwards;
    `;
    
    // Crear animación única para este icono
    const animationName = `fallDown-${Date.now()}`;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${animationName} {
        0% {
          transform: translateY(0px) rotate(0deg);
          opacity: ${opacity};
          filter: hue-rotate(0deg) drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }
        100% {
          transform: translateY(${fallDistance}px) rotate(360deg);
          opacity: 0;
          filter: hue-rotate(180deg) drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(img);
    
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
      style.remove();
    }, duration + 500);
  };

  useEffect(() => {
    if (!enabled) return;
    
    // Crear primer icono inmediatamente
    createIcon();
    
    // Intensidad controla frecuencia: intensity 1 = cada 4s, intensity 10 = cada 0.4s
    const spawnInterval = Math.max(400, 4000 / intensity);
    
    // Crear iconos según intensidad
    const interval = setInterval(createIcon, spawnInterval);
    
    return () => {
      clearInterval(interval);
    };
  }, [enabled, intensity, speed, size, opacity]);


  return enabled ? null : null;
}

'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Matter from 'matter-js';

// Iconos temáticos para e-commerce con gradientes liquid glass
const ECOMMERCE_ICONS = [
  'shopping-cart.svg',
  'heart.svg', 
  'star.svg',
  'gift.svg',
  'user.svg',
  'search.svg',
  'shop.svg',
  'credit-card.svg'
];

interface IconRainProps {
  /** Activar/desactivar el efecto */
  enabled?: boolean;
  /** Número máximo de iconos en pantalla */
  maxIcons?: number;
  /** Intervalo entre spawns en ms */
  spawnInterval?: number;
  /** Tamaño de los iconos */
  iconSize?: number;
  /** Intensidad del efecto de mouse */
  mouseIntensity?: number;
  /** Z-index del componente */
  zIndex?: number;
  /** Opacidad de los iconos */
  opacity?: number;
  /** Lado de la pantalla donde aparecen los iconos */
  side?: 'left' | 'right' | 'both';
  /** Densidad inicial de iconos */
  initialDensity?: number;
}

interface IconBody {
  body: Matter.Body;
  element: HTMLImageElement;
  id: string;
}

export default function IconRain({
  enabled = true,
  maxIcons = 100,
  spawnInterval = 50,
  iconSize = 52,
  mouseIntensity = 1.5,
  zIndex = 0,
  opacity = 0.6,
  side = 'both',
  initialDensity = 8
}: IconRainProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const iconBodiesRef = useRef<IconBody[]>([]);
  const lastSpawnRef = useRef<number>(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isDestroyedRef = useRef<boolean>(false);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Función para obtener dimensiones de la ventana
  const updateDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  // Función para crear un icono físico
  const spawnIcon = useCallback((x: number, y: number) => {
    if (!engineRef.current || isDestroyedRef.current) return;

    // Limitar número de iconos
    if (iconBodiesRef.current.length >= maxIcons) {
      const removed = iconBodiesRef.current.shift();
      if (removed) {
        Matter.Composite.remove(engineRef.current.world, removed.body);
        removed.element.remove();
      }
    }

    const iconPath = ECOMMERCE_ICONS[Math.floor(Math.random() * ECOMMERCE_ICONS.length)];
    const iconId = `icon-${Date.now()}-${Math.random()}`;
    
    // Crear elemento imagen
    const img = document.createElement('img');
    img.src = `/icons/${iconPath}`;
    img.id = iconId;
    img.style.cssText = `
      width: ${iconSize}px;
      height: ${iconSize}px;
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      user-select: none;
      opacity: ${opacity};
      filter: drop-shadow(0 0 8px rgba(0, 180, 216, 0.3)) 
              drop-shadow(0 0 16px rgba(0, 180, 216, 0.1));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: ${zIndex};
      backdrop-filter: blur(1px);
    `;

    // Agregar efectos de hover
    img.addEventListener('mouseenter', () => {
      if (!isDestroyedRef.current) {
        img.style.transform = 'scale(1.2)';
        img.style.filter = `
          drop-shadow(0 0 12px rgba(0, 180, 216, 0.5)) 
          drop-shadow(0 0 24px rgba(0, 180, 216, 0.2))
        `;
      }
    });

    img.addEventListener('mouseleave', () => {
      if (!isDestroyedRef.current) {
        img.style.transform = 'scale(1)';
        img.style.filter = `
          drop-shadow(0 0 8px rgba(0, 180, 216, 0.3)) 
          drop-shadow(0 0 16px rgba(0, 180, 216, 0.1))
        `;
      }
    });

    document.body.appendChild(img);

    // Crear cuerpo físico
    const body = Matter.Bodies.rectangle(x, y, iconSize, iconSize, {
      restitution: 0.7,
      friction: 0.05,
      frictionAir: 0.01,
      density: 0.001,
      render: { visible: false }
    });

    // Rotación inicial aleatoria
    Matter.Body.setAngle(body, Math.random() * Math.PI * 2);
    Matter.Composite.add(engineRef.current.world, body);
    
    iconBodiesRef.current.push({ body, element: img, id: iconId });
  }, [maxIcons, iconSize, opacity, zIndex]);

  // Función para determinar la posición de spawn según el lado
  const getSpawnPosition = useCallback(() => {
    const { width, height } = dimensions;
    let x: number;
    
    switch (side) {
      case 'left':
        x = Math.random() * (width * 0.2);
        break;
      case 'right':
        x = width * 0.8 + Math.random() * (width * 0.2);
        break;
      case 'both':
      default:
        x = Math.random() < 0.5 
          ? Math.random() * (width * 0.2)
          : width * 0.8 + Math.random() * (width * 0.2);
        break;
    }
    
    const y = Math.random() * height * 0.3 - 50; // Spawn desde arriba
    return { x, y };
  }, [dimensions, side]);

  // Inicializar Matter.js
  useEffect(() => {
    if (!enabled || dimensions.width === 0) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    // Crear motor físico
    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.4; // Gravedad suave

    // Crear renderizador invisible (solo para mouse tracking)
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showVelocity: false
      }
    });
    
    renderRef.current = render;
    render.canvas.style.position = 'fixed';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.pointerEvents = 'none';
    render.canvas.style.zIndex = zIndex.toString();
    render.canvas.style.opacity = '0';

    Render.run(render);

    // Crear runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Paredes invisibles
    const thickness = 50;
    const walls = [
      // Pared inferior
      Bodies.rectangle(dimensions.width / 2, dimensions.height + thickness/2, dimensions.width, thickness, { 
        isStatic: true, render: { visible: false } 
      }),
      // Paredes laterales (más permeables)
      Bodies.rectangle(-thickness/2, dimensions.height / 2, thickness, dimensions.height, { 
        isStatic: true, render: { visible: false } 
      }),
      Bodies.rectangle(dimensions.width + thickness/2, dimensions.height / 2, thickness, dimensions.height, { 
        isStatic: true, render: { visible: false } 
      })
    ];
    Composite.add(engine.world, walls);

    // Iconos iniciales
    for (let i = 0; i < initialDensity; i++) {
      setTimeout(() => {
        if (!isDestroyedRef.current) {
          const pos = getSpawnPosition();
          spawnIcon(pos.x, pos.y + Math.random() * dimensions.height * 0.5);
        }
      }, i * 100);
    }

    // Mouse tracking y constraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { 
        stiffness: mouseIntensity,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // Cleanup
    return () => {
      isDestroyedRef.current = true;
      
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      if (renderRef.current) {
        Render.stop(renderRef.current);
      }
      if (engineRef.current) {
        Composite.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      
      // Limpiar elementos del DOM
      iconBodiesRef.current.forEach(({ element }) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      iconBodiesRef.current = [];
      
      if (renderRef.current?.canvas && renderRef.current.canvas.parentNode) {
        renderRef.current.canvas.parentNode.removeChild(renderRef.current.canvas);
      }
    };
  }, [enabled, dimensions, spawnIcon, getSpawnPosition, mouseIntensity, zIndex, initialDensity]);

  // Actualizar dimensiones en resize
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Loop de spawn de iconos
  useEffect(() => {
    if (!enabled) return;

    const loop = () => {
      if (isDestroyedRef.current) return;
      
      const now = Date.now();
      if (now - lastSpawnRef.current > spawnInterval) {
        const pos = getSpawnPosition();
        spawnIcon(pos.x, pos.y);
        lastSpawnRef.current = now;
      }
      
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, spawnInterval, spawnIcon, getSpawnPosition]);

  // Actualizar posiciones de elementos DOM
  useEffect(() => {
    if (!enabled) return;

    const updatePositions = () => {
      if (isDestroyedRef.current) return;
      
      iconBodiesRef.current.forEach(({ body, element }) => {
        if (body && element) {
          const pos = body.position;
          const angle = body.angle;
          
          element.style.left = `${pos.x - iconSize/2}px`;
          element.style.top = `${pos.y - iconSize/2}px`;
          element.style.transform = `rotate(${angle}rad)`;
        }
      });
      
      requestAnimationFrame(updatePositions);
    };

    updatePositions();
  }, [enabled, iconSize]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!enabled) return null;

  return (
    <div 
      ref={sceneRef} 
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}

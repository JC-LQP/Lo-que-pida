'use client';

import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface MagicEffectsProps {
  children: React.ReactNode;
  enableParticles?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  enableClickRipple?: boolean;
  enableGlow?: boolean;
  particleCount?: number;
  className?: string;
  disableOnMobile?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 6;
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "magic-particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: linear-gradient(45deg, #8B5CF6, #06B6D4);
    box-shadow: 0 0 6px rgba(139, 92, 246, 0.8), 0 0 12px rgba(6, 182, 212, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const MagicEffects: React.FC<MagicEffectsProps> = ({
  children,
  enableParticles = true,
  enableTilt = true,
  enableMagnetism = true,
  enableClickRipple = true,
  enableGlow = true,
  particleCount = DEFAULT_PARTICLE_COUNT,
  className = "",
  disableOnMobile = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isHoveredRef = useRef(false);
  const isMobileRef = useRef(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= MOBILE_BREAKPOINT;
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!containerRef.current || !isHoveredRef.current || !enableParticles) return;
    if (disableOnMobile && isMobileRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    Array.from({ length: particleCount }, (_, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !containerRef.current) return;

        const particle = createParticleElement(
          Math.random() * width,
          Math.random() * height
        );

        containerRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        // Aparición suave
        gsap.fromTo(
          particle,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        // Movimiento flotante
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        // Pulsación de brillo
        gsap.to(particle, {
          opacity: 0.4,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [enableParticles, particleCount, disableOnMobile]);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    let magnetismAnimation: gsap.core.Tween | null = null;

    const handleMouseEnter = () => {
      if (disableOnMobile && isMobileRef.current) return;
      
      isHoveredRef.current = true;
      animateParticles();

      // Efecto de glow al hover
      if (enableGlow) {
        gsap.to(element, {
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3), 0 0 20px rgba(6, 182, 212, 0.2)",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Efecto de elevación sutil
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 2,
          rotateY: 2,
          z: 10,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      // Remover efectos
      if (enableGlow) {
        gsap.to(element, {
          boxShadow: "none",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (enableMagnetism && magnetismAnimation) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (disableOnMobile && isMobileRef.current) return;
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.02;
        const magnetY = (y - centerY) * 0.02;

        magnetismAnimation = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!enableClickRipple || (disableOnMobile && isMobileRef.current)) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calcular el radio máximo para cubrir todo el elemento
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, 
          rgba(139, 92, 246, 0.3) 0%, 
          rgba(6, 182, 212, 0.2) 30%, 
          transparent 70%
        );
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
      magnetismAnimation?.kill();
    };
  }, [
    animateParticles,
    clearAllParticles,
    enableTilt,
    enableMagnetism,
    enableClickRipple,
    enableGlow,
    disableOnMobile,
  ]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};

export default MagicEffects;

"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "", 
  size = "md" 
}) => {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSize = {
    sm: "16",
    md: "18",
    lg: "20"
  };

  // Iconos SVG optimizados
  const SunIcon = () => (
    <svg 
      width={iconSize[size]} 
      height={iconSize[size]} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-300 ease-in-out"
    >
      <path 
        d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg 
      width={iconSize[size]} 
      height={iconSize[size]} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-300 ease-in-out"
    >
      <path 
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <button
      onClick={toggleTheme}
      className={`${className}
        relative w-12 h-6
        bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800
        rounded-full 
        border border-gray-300 dark:border-gray-600
        transition-all duration-300 ease-in-out
        shadow-inner hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
        group
      `}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Toggle circle */}
      <div 
        className={`absolute top-0.5 w-5 h-5 rounded-full 
          bg-white dark:bg-gray-200
          shadow-md 
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          border border-gray-300 dark:border-gray-500
          ${isDark ? 'translate-x-6' : 'translate-x-0.5'}
        `}
      >
        {/* Icono dentro del círculo */}
        <div className={`transition-all duration-300 ${isDark ? 'text-gray-700' : 'text-yellow-500'}`}>
          {isDark ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
            </svg>
          )}
        </div>
      </div>
      
      {/* Background gradient effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-90' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20'
      }`} />
    </button>
  );
};

export default ThemeToggle;

"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface UseThemeReturn {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Aplicar tema al DOM
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Cambiar tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Inicializar tema al montar el componente
  useEffect(() => {
    // Obtener tema inicial del localStorage o usar light como default
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    
    setThemeState(savedTheme);
    applyTheme(savedTheme);
    
    setMounted(true);
  }, []);

  // Prevenir hidration mismatch
  if (!mounted) {
    return {
      isDark: false,
      theme: "light",
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }

  return {
    isDark: theme === "dark",
    theme,
    toggleTheme,
    setTheme,
  };
};

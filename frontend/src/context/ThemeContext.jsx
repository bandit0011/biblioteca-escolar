import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // 'system' es el valor por defecto
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system"); 

  useEffect(() => {
    const body = window.document.body;
    
    // Limpiar clases antiguas
    body.classList.remove("light-mode", "dark-mode", "high-contrast-mode");

    if (theme === "system") {
      // Usar el tema del Sistema Operativo
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (!systemPrefersDark) {
         body.classList.add("light-mode");
      }
      // (Oscuro es el por defecto en el CSS, por eso no añadimos 'dark-mode')
    } else if (theme === "light") {
      body.classList.add("light-mode");
    } else if (theme === "high-contrast") {
      body.classList.add("high-contrast-mode");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext(null);

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState("light");

//   // On mount, read saved preference or system preference
//   useEffect(() => {
//     const saved = localStorage.getItem("fuel-theme");
//     if (saved) {
//       setTheme(saved);
//       document.documentElement.setAttribute("data-theme", saved);
//     } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
//       setTheme("dark");
//       document.documentElement.setAttribute("data-theme", "dark");
//     }
//   }, []);

//   const toggleTheme = () => {
//     const next = theme === "light" ? "dark" : "light";
//     setTheme(next);
//     localStorage.setItem("fuel-theme", next);
//     document.documentElement.setAttribute("data-theme", next);
//   };

//   return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
// }

// // Hook — use anywhere: const { theme, toggleTheme } = useTheme()
// export function useTheme() {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
//   return ctx;
// }

"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("fuel-theme");

    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("fuel-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

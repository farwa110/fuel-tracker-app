"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/components/ThemeProvider";
import { motion } from "framer-motion";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="
        inline-flex items-center gap-2 rounded-full
        border border-(--border)
        bg-(--surface)
        px-3 py-2 text-sm font-medium
        text-(--text-secondary)
        shadow-(--shadow-sm)
        transition-all duration-200
        hover:border-(--border-strong)
        hover:text-(--text-primary)
      "
    >
      <span className="text-base">{theme === "light" ? "☾" : "☀"}</span>

      <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
    </motion.button>
  );
}

function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      setDateTime(new Date());
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return null;

  const date = dateTime.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const time = dateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="
        rounded-full border border-(--border)
        bg-(--surface)
        px-3 py-2 text-sm font-medium
        text-(--text-secondary)
        shadow-(--shadow-sm)
      "
    >
      <span className="hidden min-[500px]:inline">
        {date} · {time}
      </span>

      <span className="min-[500px]:hidden">{time}</span>
    </div>
  );
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-(--border)
        bg-[color-mix(in_srgb,var(--bg)_88%,transparent)]
        backdrop-blur-xl
      w-full left-0 right-0
      "
    >
      <div
        className="
          flex items-center justify-end
          px-4 sm:px-6 lg:px-8 py-4
        "
      >
        <div className="flex items-center gap-3">
          <DateTimeDisplay />

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

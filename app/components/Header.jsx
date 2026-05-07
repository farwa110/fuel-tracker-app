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
        border border-[var(--border)]
        bg-[var(--surface)]
        px-3 py-2 text-sm font-medium
        text-[var(--text-secondary)]
        shadow-[var(--shadow-sm)]
        transition-all duration-200
        hover:border-[var(--border-strong)]
        hover:text-[var(--text-primary)]
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
        rounded-full border border-[var(--border)]
        bg-[var(--surface)]
        px-3 py-2 text-sm font-medium
        text-[var(--text-secondary)]
        shadow-[var(--shadow-sm)]
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
        border-b border-[var(--border)]
        bg-[color-mix(in_srgb,var(--bg)_88%,transparent)]
        backdrop-blur-xl
        min-[500px]:lg:ml-[280px]
      "
    >
      <div
        className="
          flex h-16 items-center justify-end
          px-4 sm:px-6 lg:px-8
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

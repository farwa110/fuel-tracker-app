"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
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
    const updateTime = () => setDateTime(new Date());
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
    <div className="rounded-full border border-(--border) bg-(--surface) px-3 py-2 text-sm font-medium text-(--text-secondary) shadow-(--shadow-sm)">
      <span className="hidden min-[500px]:inline">
        {date} · {time}
      </span>
      <span className="min-[500px]:hidden">{time}</span>
    </div>
  );
}

function Logo({ updatedAt }) {
  return (
    <div className="flex items-start gap-3.5 px-1 py-4 ">
      {/* Logo */}
      <div className="shrink-0 w-10  overflow-hidden flex items-center justify-center">
        <Link href="/">
          <Image src="/logo-grey.png" alt="Fuelprice Tracker DK logo" width={80} height={80} className="object-contain scale-[2.2] translate-y-1" priority />
        </Link>
      </div>

      {/* Text */}
      <div className="flex flex-col pt-0.5">
        {/* Title + Badge */}
        <div className="flex items-center gap-2 leading-none">
          <h1 className="text-[20px] font-medium tracking-tight text-(--text-primary)">Fuelprice</h1>
          <span className="bg-[#1b1b1d] text-white text-[9px] font-bold tracking-[0.12em] px-1.5 py-0.5 rounded-[5px] leading-none">DK</span>
        </div>

        {/* Subtitle */}
        <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--text-secondary)">Tracker</div>

        {/* Updated at */}
        {updatedAt && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span>
              Updated{" "}
              {new Date(updatedAt).toLocaleTimeString("da-DK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeHeader({ updatedAt }) {
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
      <div className="flex  items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left — Logo */}
        <Logo updatedAt={updatedAt} />

        {/* Right — DateTime + Theme toggle */}
        <div className="flex items-center gap-3">
          <DateTimeDisplay />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

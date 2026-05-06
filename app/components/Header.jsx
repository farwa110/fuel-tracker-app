"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/app/components/ThemeProvider";

// ── Animation variants ────────────────────────────────────────────────────
const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 },
  },
};

const rightVariants = {
  hidden: { x: 16, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.2 },
  },
};

// ── Sub-component: Live status dot ────────────────────────────────────────
function LiveDot({ updatedAt }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Pulsing green dot */}
      <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "var(--green)",
            opacity: 0.4,
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <span
          style={{
            position: "relative",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--green)",
            display: "block",
          }}
        />
      </span>
      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}` : "Loading prices…"}</span>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-component: Theme toggle button ───────────────────────────────────
function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
        color: "var(--text-secondary)",
        fontSize: 13,
        fontFamily: "var(--font-sans)",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.15s, color 0.15s",
        userSelect: "none",
      }}
    >
      <motion.span key={theme} initial={{ rotate: -30, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }} style={{ display: "inline-block", lineHeight: 1 }}>
        {theme === "light" ? "🌙" : "☀️"}
      </motion.span>
      {theme === "light" ? "Dark" : "Light"}
    </motion.button>
  );
}

// ── Main Header component ─────────────────────────────────────────────────
export default function Header({ updatedAt, stationCount }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="container"
        style={{
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Left: Logo + title */}
        <motion.div variants={logoVariants} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Fuel pump icon */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ⛽
          </div>

          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.4px",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Fuel Tracker DK
            </div>

            <LiveDot updatedAt={updatedAt} />
          </div>
        </motion.div>

        {/* Right: station count badge + theme toggle */}
        <motion.div variants={rightVariants} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Station count pill — only shows when data is loaded */}
          {stationCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-xl)",
                background: "var(--accent-dim)",
                border: "1px solid var(--accent-border)",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--accent)",
                letterSpacing: "-0.2px",
              }}
            >
              {stationCount} stations
            </motion.div>
          )}

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </motion.div>
      </div>
    </motion.header>
  );
}

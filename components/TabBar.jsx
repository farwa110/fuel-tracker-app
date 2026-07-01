"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

const TABS = [
  { id: "nearby", label: "Nearby" },
  { id: "cities", label: "Cities" },
  { id: "history", label: "History" },
  { id: "favorites", label: "Favorites" },
];

// Usage:
// <TabBar activeTab={activeTab} onChange={(id) => setActiveTab(id)} />

export default function TabBar({ activeTab = "nearby", onChange }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      style={{
        display: "flex",
        gap: 4,
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-md)",
        padding: 4,
        marginBottom: "1.1rem",
        position: "relative",
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const isHovered = tab.id === hovered;

        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            onMouseEnter={() => setHovered(tab.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              position: "relative",
              padding: "8px 0",
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              fontFamily: "var(--font-sans)",
              border: "none",
              background: "transparent",
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              borderRadius: "var(--radius-sm)",
              zIndex: 1,
              transition: "color 0.15s ease",
              userSelect: "none",
            }}
          >
            {/* Sliding active background */}
            {isActive && (
              <motion.div
                layoutId="tabIndicator"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--surface)",
                  borderRadius: "var(--radius-sm)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--border)",
                  zIndex: -1,
                }}
              />
            )}

            {/* Hover ghost background */}
            {isHovered && !isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--surface-hover)",
                  borderRadius: "var(--radius-sm)",
                  zIndex: -1,
                }}
              />
            )}

            {tab.label}
          </button>
        );
      })}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

const FUEL_TYPES = [
  { id: "benzin95", label: "Benzin 95" },
  { id: "benzin95extra", label: "Benzin 98" },
  { id: "diesel", label: "Diesel" },
  { id: "dieselExtra", label: "Diesel Extra" },
  { id: "el", label: "El" },
];

// Usage:
// <FuelPills
//   options={["benzin95", "diesel"]}   // optional: limit which pills show
//   selected="benzin95"
//   onChange={(id) => setFuel(id)}
// />

export default function FuelPills({
  options, // array of fuel ids to show — defaults to all
  selected = "benzin95",
  onChange,
}) {
  const pills = options ? FUEL_TYPES.filter((f) => options.includes(f.id)) : FUEL_TYPES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.25 }}
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: "0.9rem",
      }}
    >
      {pills.map((fuel, i) => {
        const isActive = fuel.id === selected;

        return (
          <motion.button
            key={fuel.id}
            onClick={() => onChange?.(fuel.id)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.05 * i,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: "relative",
              padding: "6px 16px",
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              fontWeight: isActive ? 500 : 400,
              borderRadius: 20,
              border: isActive ? "1px solid var(--accent-border)" : "1px solid var(--border)",
              background: isActive ? "var(--accent-dim)" : "transparent",
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s, color 0.15s",
              userSelect: "none",
              overflow: "hidden",
            }}
          >
            {/* Active indicator dot */}
            {isActive && (
              <motion.span
                layoutId="pillActive"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--accent-dim)",
                  borderRadius: 20,
                  zIndex: -1,
                }}
              />
            )}

            {fuel.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

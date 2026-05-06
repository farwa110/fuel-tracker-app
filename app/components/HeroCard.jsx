"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target || isNaN(target)) return;
    const start = performance.now();
    const from = 0;
    const to = parseFloat(target);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ── Single metric card ────────────────────────────────────────────────────
function MetricCard({ label, value, delta, unit = "kr/L", index }) {
  const animated = useCountUp(value, 900);
  const isUp = delta > 0;
  const isDown = delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.1 + index * 0.07,
      }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: 11,
          color: "var(--text-secondary)",
          letterSpacing: "0.2px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>

      {/* Animated value */}
      <span
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.8px",
          color: "var(--text-primary)",
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value != null ? animated.toFixed(2) : "—"}
      </span>

      {/* Delta */}
      {delta != null && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.07 }}
          style={{
            fontSize: 11,
            color: isUp ? "var(--red)" : isDown ? "var(--green)" : "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isUp ? "+" : ""}
          {delta?.toFixed(2)} kr today
        </motion.span>
      )}
    </motion.div>
  );
}

// ── MetricsRow ────────────────────────────────────────────────────────────
// Usage:
// <MetricsRow
//   benzin={{ value: 15.89, delta: +0.12 }}
//   diesel={{ value: 14.42, delta: -0.05 }}
//   el={{ value: 3.85, delta: -0.08 }}
// />

export default function MetricsRow({ benzin, diesel, el }) {
  const metrics = [
    { label: "Avg Benzin", unit: "kr/L", ...benzin },
    { label: "Avg Diesel", unit: "kr/L", ...diesel },
    { label: "Avg El (kWh)", unit: "kr/kWh", ...el },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
        marginBottom: "0.9rem",
      }}
    >
      {metrics.map((m, i) => (
        <MetricCard key={m.label} index={i} {...m} />
      ))}
    </div>
  );
}

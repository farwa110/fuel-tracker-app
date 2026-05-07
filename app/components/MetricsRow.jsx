// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";

// // ── Count-up animation ────────────────────────────────────────────────────────
// function useCountUp(target, duration = 900) {
//   const [value, setValue] = useState(0);
//   const rafRef = useRef(null);

//   useEffect(() => {
//     if (!target || isNaN(target)) return;
//     const start = performance.now();
//     const to = parseFloat(target);

//     const tick = (now) => {
//       const progress = Math.min((now - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setValue(to * eased);
//       if (progress < 1) rafRef.current = requestAnimationFrame(tick);
//     };

//     rafRef.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, [target, duration]);

//   return value;
// }

// // ── Single metric card ────────────────────────────────────────────────────────
// function MetricCard({ label, sublabel, value, highlight, colorVar, index }) {
//   const animated = useCountUp(value, 900);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.1 + index * 0.08 }}
//       style={{
//         background: highlight ? `var(${colorVar}-dim, var(--accent-dim))` : "var(--surface)",
//         border: `1px solid ${highlight ? `var(${colorVar}-border, var(--accent-border))` : "var(--border)"}`,
//         borderRadius: "var(--radius-md)",
//         padding: "12px 14px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 2,
//         minWidth: 0,
//       }}
//     >
//       <span style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</span>

//       <span
//         style={{
//           fontSize: 22,
//           fontWeight: 600,
//           letterSpacing: "-0.8px",
//           color: highlight ? `var(${colorVar}, var(--accent))` : "var(--text-primary)",
//           lineHeight: 1.1,
//           fontVariantNumeric: "tabular-nums",
//         }}
//       >
//         {value != null ? animated.toFixed(2) : "—"}
//       </span>

//       <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{sublabel}</span>
//     </motion.div>
//   );
// }

// // ── MetricsRow ────────────────────────────────────────────────────────────────
// // Usage:
// // <MetricsRow allStations={allStations} fuel={fuel} />
// //
// // Computes cheapest, average, most expensive from real station data
// // This is what actually matters to a driver

// export default function MetricsRow({ allStations = [], fuel = "benzin95" }) {
//   // Compute directly from real station data
//   const prices = allStations.map((s) => s.prices?.[fuel]?.price).filter((p) => p > 0);

//   const cheapest = prices.length ? Math.min(...prices) : null;
//   const average = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
//   const priciest = prices.length ? Math.max(...prices) : null;

//   const saving = cheapest && priciest ? (priciest - cheapest).toFixed(2) : null;

//   const cards = [
//     {
//       label: "Cheapest",
//       sublabel: saving ? `Save ${saving} kr vs priciest` : "kr/L today",
//       value: cheapest,
//       highlight: true,
//       colorVar: "--green",
//     },
//     {
//       label: "Denmark avg",
//       sublabel: `${prices.length} stations`,
//       value: average,
//       highlight: false,
//       colorVar: "--accent",
//     },
//     {
//       label: "Most expensive",
//       sublabel: "kr/L today",
//       value: priciest,
//       highlight: false,
//       colorVar: "--red",
//     },
//   ];

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gap: 8,
//         marginBottom: "0.9rem",
//       }}
//     >
//       {cards.map((card, i) => (
//         <MetricCard key={card.label} index={i} {...card} />
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target == null || isNaN(target)) {
      setValue(0);
      return;
    }

    const start = performance.now();
    const to = parseFloat(target);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(to * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function MetricCard({ label, sublabel, value, highlight, colorVar, index }) {
  const animated = useCountUp(value, 900);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
        delay: 0.08 + index * 0.06,
      }}
      className="
        min-w-0 rounded-[var(--radius-lg)]
        border p-4 shadow-[var(--shadow-sm)]
        sm:p-5
      "
      style={{
        background: highlight ? `var(${colorVar}-dim, var(--accent-dim))` : "var(--surface)",
        borderColor: highlight ? `var(${colorVar}-border, var(--accent-border))` : "var(--border)",
      }}
    >
      <p
        className="
          text-[10px] font-medium uppercase
          tracking-[0.08em] text-[var(--text-secondary)]
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2 text-[26px] font-bold
          leading-none tracking-[-0.05em]
          tabular-nums sm:text-[28px]
        "
        style={{
          color: highlight ? `var(${colorVar}, var(--accent))` : "var(--text-primary)",
        }}
      >
        {value != null ? animated.toFixed(2) : "—"}
      </p>

      <p className="mt-2 text-xs leading-4 text-[var(--text-secondary)]">{sublabel}</p>
    </motion.article>
  );
}

export default function MetricsRow({ allStations = [], fuel = "benzin95" }) {
  const prices = allStations.map((s) => s.prices?.[fuel]?.price).filter((p) => p > 0);

  const cheapest = prices.length ? Math.min(...prices) : null;
  const average = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
  const priciest = prices.length ? Math.max(...prices) : null;

  const saving = cheapest != null && priciest != null ? (priciest - cheapest).toFixed(2) : null;

  const cards = [
    {
      label: "Cheapest",
      sublabel: saving ? `Save ${saving} kr vs priciest` : "kr/L today",
      value: cheapest,
      highlight: true,
      colorVar: "--green",
    },
    {
      label: "Denmark avg",
      sublabel: `${prices.length} stations`,
      value: average,
      highlight: false,
      colorVar: "--accent",
    },
    {
      label: "Most expensive",
      sublabel: "kr/L today",
      value: priciest,
      highlight: false,
      colorVar: "--red",
    },
  ];

  return (
    <section className="mb-5 grid gap-3 sm:grid-cols-3">
      {cards.map((card, i) => (
        <MetricCard key={card.label} index={i} {...card} />
      ))}
    </section>
  );
}

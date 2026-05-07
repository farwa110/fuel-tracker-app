"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Bar chart — pure CSS/SVG, no extra lib needed ─────────────────────────
function CityBar({ city, value, max, isMin, isMax, index }) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: index * 0.04 }} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      {/* City name */}
      <div
        style={{
          width: 90,
          flexShrink: 0,
          fontSize: 12,
          color: "var(--text-primary)",
          fontWeight: isMin ? 500 : 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {city}
      </div>

      {/* Bar */}
      <div
        style={{
          flex: 1,
          height: 28,
          background: "var(--bg-secondary)",
          borderRadius: 6,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.1 + index * 0.04 }}
          style={{
            height: "100%",
            borderRadius: 6,
            background: isMin ? "var(--green)" : isMax ? "var(--red)" : "var(--accent)",
            opacity: isMin || isMax ? 1 : 0.75,
          }}
        />
      </div>

      {/* Price */}
      <div
        style={{
          width: 54,
          flexShrink: 0,
          textAlign: "right",
          fontSize: 13,
          fontWeight: 500,
          color: isMin ? "var(--green)" : isMax ? "var(--red)" : "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value?.toFixed(2)}
      </div>

      {/* Badge */}
      <div style={{ width: 56, flexShrink: 0 }}>
        {isMin && (
          <span
            style={{
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 10,
              background: "var(--green-dim)",
              color: "var(--green)",
              border: "1px solid rgba(5,150,105,0.2)",
              fontWeight: 500,
            }}
          >
            Cheapest
          </span>
        )}
        {isMax && (
          <span
            style={{
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 10,
              background: "var(--red-dim)",
              color: "var(--red)",
              border: "1px solid rgba(220,38,38,0.2)",
              fontWeight: 500,
            }}
          >
            Priciest
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── City grid cards ───────────────────────────────────────────────────────
function CityCard({ city, fuel, isMin, index }) {
  const price = city[fuel];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.05 }}
      style={{
        background: isMin ? "var(--green-dim)" : "var(--surface)",
        border: `1px solid ${isMin ? "rgba(5,150,105,0.25)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{city.name}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.6px",
          color: isMin ? "var(--green)" : "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {price?.toFixed(2) ?? "—"}
      </div>
      <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>{city.count} stations</div>
    </motion.div>
  );
}

// ── CitiesTab ─────────────────────────────────────────────────────────────
// Usage:
// <CitiesTab citiesSummary={citiesSummary} loading={loading} />

export default function CitiesTab({ citiesSummary = [], loading = false }) {
  const [fuel, setFuel] = useState("benzin95");
  const [view, setView] = useState("bars"); // "bars" | "grid"

  const prices = citiesSummary.map((c) => c[fuel]).filter(Boolean);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "1rem 0" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 32,
              borderRadius: 8,
              background: "var(--bg-secondary)",
              animation: "shimmer 1.5s infinite",
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
        <style>{`@keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
      </div>
    );
  }

  if (!citiesSummary.length) {
    return <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)", fontSize: 14 }}>No city data available yet.</div>;
  }

  return (
    <div>
      {/* Controls row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
        {/* Fuel selector */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "benzin95", label: "Benzin 95" },
            { id: "diesel", label: "Diesel" },
          ].map((f) => (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFuel(f.id)}
              style={{
                padding: "5px 14px",
                fontSize: 12,
                borderRadius: 20,
                border: fuel === f.id ? "1px solid var(--accent-border)" : "1px solid var(--border)",
                background: fuel === f.id ? "var(--accent-dim)" : "transparent",
                color: fuel === f.id ? "var(--accent)" : "var(--text-secondary)",
                fontFamily: "var(--font-sans)",
                fontWeight: fuel === f.id ? 500 : 400,
                cursor: "pointer",
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg-secondary)", borderRadius: 8, padding: 3 }}>
          {[
            { id: "bars", icon: "▤" },
            { id: "grid", icon: "⊞" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: "4px 10px",
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                borderRadius: 6,
                fontFamily: "var(--font-sans)",
                background: view === v.id ? "var(--surface)" : "transparent",
                color: view === v.id ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: view === v.id ? "var(--shadow-sm)" : "none",
              }}
            >
              {v.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: "1rem",
        }}
      >
        {[
          { label: "Cheapest city", value: citiesSummary[0]?.name, sub: citiesSummary[0]?.[fuel]?.toFixed(2) + " kr" },
          { label: "Avg across DK", value: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) + " kr", sub: `${citiesSummary.length} cities` },
          { label: "Most expensive", value: citiesSummary[citiesSummary.length - 1]?.name, sub: citiesSummary[citiesSummary.length - 1]?.[fuel]?.toFixed(2) + " kr" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart or grid */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.1rem",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            marginBottom: "1rem",
          }}
        >
          {fuel === "benzin95" ? "Benzin 95" : "Diesel"} · kr/L by city
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={view + fuel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === "bars" ? (
              <div>
                {citiesSummary.map((city, i) => (
                  <CityBar key={city.name} city={city.name} value={city[fuel]} max={maxPrice} isMin={city[fuel] === minPrice} isMax={city[fuel] === maxPrice} index={i} />
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 8 }}>
                {citiesSummary.map((city, i) => (
                  <CityCard key={city.name} city={city} fuel={fuel} isMin={city[fuel] === minPrice} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

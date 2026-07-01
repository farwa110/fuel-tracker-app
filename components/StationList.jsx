"use client";

import { motion, AnimatePresence } from "framer-motion";

// ── Brand config ──────────────────────────────────────────────────────────────
const BRAND_CONFIG = {
  "Circle K": { short: "CK", bg: "rgba(237,28,36,0.1)", color: "#ED1C24" },
  INGO: { short: "IN", bg: "rgba(255,140,0,0.12)", color: "#FF8C00" },
  "Q8/F24": { short: "Q8", bg: "rgba(232,160,32,0.12)", color: "#D97706" },
  F24: { short: "F24", bg: "rgba(232,160,32,0.12)", color: "#D97706" },
  default: { short: "⛽", bg: "rgba(100,100,100,0.1)", color: "#666" },
};

function getBrand(brand = "") {
  return BRAND_CONFIG[brand] || BRAND_CONFIG.default;
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 12px",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-sm)",
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--border)", flexShrink: 0, animation: "shimmer 1.5s infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ width: "45%", height: 12, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ width: "70%", height: 10, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite 0.1s" }} />
      </div>
      <div style={{ width: 52, height: 18, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite 0.2s" }} />
      <style>{`@keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
    </motion.div>
  );
}

// ── Single station row ────────────────────────────────────────────────────────
function StationRow({ station, fuel, isCheapest, index, onFavToggle, isFav }) {
  const priceObj = station.prices?.[fuel];
  const price = priceObj?.price;
  const brand = getBrand(station.brand);
  const hasCoords = station.distanceKm != null && station.distanceKm < 9999;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
        delay: Math.min(index * 0.04, 0.3),
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 12px",
        background: isCheapest ? "var(--green-dim)" : "var(--bg-secondary)",
        borderRadius: "var(--radius-sm)",
        border: isCheapest ? "1px solid rgba(5,150,105,0.2)" : "1px solid transparent",
      }}
    >
      {/* Brand logo */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: brand.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: brand.color,
          flexShrink: 0,
          letterSpacing: "-0.3px",
        }}
      >
        {brand.short}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {station.name}
          {isCheapest && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                background: "var(--green-dim)",
                color: "var(--green)",
                border: "1px solid rgba(5,150,105,0.2)",
                padding: "1px 7px",
                borderRadius: 10,
                flexShrink: 0,
              }}
            >
              Cheapest
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 1,
          }}
        >
          {station.address || station.city}
          {hasCoords && <span style={{ marginLeft: 6, color: "var(--text-tertiary)" }}>· {station.distanceKm.toFixed(1)} km</span>}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: isCheapest ? "var(--green)" : "var(--text-primary)",
            letterSpacing: "-0.4px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {price != null ? `${price.toFixed(2)} kr` : "—"}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>kr/L</div>
      </div>

      {/* Favorite */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => onFavToggle?.(station.stationId)}
        style={{
          background: "none",
          border: "none",
          fontSize: 16,
          cursor: "pointer",
          color: isFav ? "var(--accent)" : "var(--text-tertiary)",
          padding: "4px",
          flexShrink: 0,
          lineHeight: 1,
          transition: "color 0.15s",
        }}
      >
        {isFav ? "★" : "☆"}
      </motion.button>
    </motion.div>
  );
}

// ── StationList ───────────────────────────────────────────────────────────────
export default function StationList({ stations = [], fuel = "benzin95", loading = false, query = "", onQueryChange, favorites = new Set(), onFavToggle, hasLocation = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem 1.1rem",
        marginBottom: "0.9rem",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.4px",
          marginBottom: "0.8rem",
        }}
      >
        {hasLocation ? "Nearest stations" : "Cheapest stations · Denmark"}
        {!loading && stations.length > 0 && <span style={{ color: "var(--text-tertiary)", fontWeight: 400, marginLeft: 6 }}>· {stations.length} shown</span>}
      </div>

      {/* Search */}
      <div style={{ marginBottom: "0.8rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Search by name, brand, city or address…"
          style={{
            width: "100%",
            padding: "9px 13px",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)
        ) : stations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            {query ? `No stations matching "${query}"` : "No stations found."}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {stations.map((station, i) => (
              <StationRow key={`${station.stationId}-${i}`} station={station} fuel={fuel} isCheapest={i === 0 && !query} index={i} isFav={favorites.has(station.stationId)} onFavToggle={onFavToggle} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

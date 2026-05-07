"use client";

import { motion, AnimatePresence } from "framer-motion";

// ── Rule engine — generates advice from real price data ───────────────────────
function generateAdvice({ allStations, fuel, hasLocation, hero, stations }) {
  const tips = [];

  if (!allStations.length) return tips;

  // Get prices for current fuel type
  const prices = allStations.map((s) => s.prices?.[fuel]?.price).filter((p) => p > 0);

  if (!prices.length) return tips;

  const cheapest = Math.min(...prices);
  const average = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priciest = Math.max(...prices);
  const saving = priciest - cheapest;
  const nearMe = stations?.[0]?.prices?.[fuel]?.price;
  const nearName = stations?.[0]?.name;
  const nearDist = stations?.[0]?.distanceKm;

  // ── Rule 1: Big saving available ─────────────────────────────────────────
  if (saving > 3) {
    tips.push({
      icon: "💰",
      title: "Big price gap today",
      text: `There's a ${saving.toFixed(2)} kr/L difference between cheapest and most expensive stations. Choosing wisely saves you ${(saving * 50).toFixed(0)} kr on a full 50L tank.`,
      type: "saving",
    });
  }

  // ── Rule 2: Nearby station vs average ────────────────────────────────────
  if (hasLocation && nearMe && nearDist != null) {
    const vsDk = nearMe - average;
    if (vsDk < -0.5) {
      tips.push({
        icon: "📍",
        title: "Great price near you",
        text: `${nearName} (${nearDist.toFixed(1)} km away) is ${Math.abs(vsDk).toFixed(2)} kr/L cheaper than the Danish average. Good time to fill up!`,
        type: "good",
      });
    } else if (vsDk > 0.8) {
      tips.push({
        icon: "⚠️",
        title: "Pricey station nearby",
        text: `Your nearest station is ${vsDk.toFixed(2)} kr/L above average. Worth driving a bit further — you could save ${(vsDk * 50).toFixed(0)} kr on a full tank.`,
        type: "warning",
      });
    } else {
      tips.push({
        icon: "✅",
        title: "Fair price near you",
        text: `${nearName} is priced close to the Danish average. ${nearDist < 1 ? "Very convenient at just " + (nearDist * 1000).toFixed(0) + "m away." : nearDist.toFixed(1) + " km away."}`,
        type: "neutral",
      });
    }
  }

  // ── Rule 3: No location — push to enable ─────────────────────────────────
  if (!hasLocation) {
    tips.push({
      icon: "📍",
      title: "Enable location for better tips",
      text: `The cheapest station in Denmark today is ${cheapest.toFixed(2)} kr/L. Allow location to find the cheapest one near you.`,
      type: "neutral",
    });
  }

  // ── Rule 4: Diesel vs Benzin comparison ──────────────────────────────────
  if (fuel === "benzin95") {
    const dieselPrices = allStations.map((s) => s.prices?.diesel?.price).filter((p) => p > 0);
    if (dieselPrices.length) {
      const avgDiesel = dieselPrices.reduce((a, b) => a + b, 0) / dieselPrices.length;
      const diff = average - avgDiesel;
      if (diff > 0.5) {
        tips.push({
          icon: "⛽",
          title: "Diesel is cheaper right now",
          text: `Diesel averages ${avgDiesel.toFixed(2)} kr/L — ${diff.toFixed(2)} kr/L less than Benzin 95 today.`,
          type: "info",
        });
      }
    }
  }

  // ── Rule 5: Price spread tells market story ───────────────────────────────
  const spread = priciest - cheapest;
  if (spread < 1.5) {
    tips.push({
      icon: "📊",
      title: "Stable prices today",
      text: `Prices are consistent across Denmark — only ${spread.toFixed(2)} kr/L between cheapest and priciest. No need to hunt for deals today.`,
      type: "info",
    });
  }

  // ── Rule 6: Tank fill savings calculation ─────────────────────────────────
  if (hasLocation && nearMe) {
    const vsCheapest = nearMe - cheapest;
    if (vsCheapest > 1) {
      tips.push({
        icon: "🧮",
        title: "Full tank calculation",
        text: `Filling 50L at your nearest station vs cheapest in DK costs ${(vsCheapest * 50).toFixed(0)} kr more. Is driving further worth it?`,
        type: "info",
      });
    }
  }

  return tips.slice(0, 3); // max 3 tips
}

// ── Tip type → color mapping ──────────────────────────────────────────────────
const TYPE_STYLES = {
  saving: { bg: "var(--green-dim)", border: "rgba(5,150,105,0.2)", icon: "var(--green)" },
  good: { bg: "var(--green-dim)", border: "rgba(5,150,105,0.2)", icon: "var(--green)" },
  warning: { bg: "var(--red-dim)", border: "rgba(220,38,38,0.15)", icon: "var(--red)" },
  neutral: { bg: "var(--accent-dim)", border: "var(--accent-border)", icon: "var(--accent)" },
  info: { bg: "var(--bg-secondary)", border: "var(--border)", icon: "var(--text-secondary)" },
};

// ── Single tip card ───────────────────────────────────────────────────────────
function TipCard({ tip, index }) {
  const style = TYPE_STYLES[tip.type] || TYPE_STYLES.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: index * 0.08 }}
      style={{
        display: "flex",
        gap: 12,
        padding: "11px 13px",
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: "var(--radius-sm)",
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{tip.icon}</span>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 3,
          }}
        >
          {tip.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {tip.text}
        </div>
      </div>
    </motion.div>
  );
}

// ── AdviceCard ────────────────────────────────────────────────────────────────
// Usage:
// <AdviceCard
//   allStations={allStations}
//   stations={displayStations}
//   fuel={fuel}
//   hasLocation={hasLocation}
//   hero={hero}
// />

export default function AdviceCard({ allStations = [], stations = [], fuel = "benzin95", hasLocation = false, hero = null }) {
  const tips = generateAdvice({ allStations, fuel, hasLocation, hero, stations });

  if (!tips.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem 1.1rem",
        marginBottom: "0.9rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: "0.8rem",
        }}
      >
        <span style={{ fontSize: 14 }}>💡</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          Smart Advice
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            color: "var(--text-tertiary)",
            background: "var(--bg-secondary)",
            padding: "2px 8px",
            borderRadius: 10,
          }}
        >
          Based on live data
        </span>
      </div>

      {/* Tips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <AnimatePresence mode="popLayout">
          {tips.map((tip, i) => (
            <TipCard key={`${tip.type}-${i}`} tip={tip} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

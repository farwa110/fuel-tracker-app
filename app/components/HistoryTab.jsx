"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ── Static historical data (EU Oil Bulletin — DK averages) ────────────────
// Replace with real API data when you add the OpenVan.camp endpoint
const HISTORY = {
  benzin95: [
    { month: "Maj 24", price: 14.85 },
    { month: "Jun", price: 15.1 },
    { month: "Jul", price: 15.42 },
    { month: "Aug", price: 15.68 },
    { month: "Sep", price: 15.31 },
    { month: "Okt", price: 15.12 },
    { month: "Nov", price: 14.98 },
    { month: "Dec", price: 15.05 },
    { month: "Jan 25", price: 15.41 },
    { month: "Feb", price: 15.62 },
    { month: "Mar", price: 15.78 },
    { month: "Apr", price: 15.89 },
  ],
  diesel: [
    { month: "Maj 24", price: 13.42 },
    { month: "Jun", price: 13.68 },
    { month: "Jul", price: 13.95 },
    { month: "Aug", price: 14.12 },
    { month: "Sep", price: 13.88 },
    { month: "Okt", price: 13.72 },
    { month: "Nov", price: 13.58 },
    { month: "Dec", price: 13.65 },
    { month: "Jan 25", price: 13.98 },
    { month: "Feb", price: 14.12 },
    { month: "Mar", price: 14.28 },
    { month: "Apr", price: 14.42 },
  ],
};

// ── SVG Line Chart ────────────────────────────────────────────────────────
function LineChart({ data, color }) {
  const W = 540,
    H = 180;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const prices = data.map((d) => d.price);
  const minP = Math.min(...prices) - 0.3;
  const maxP = Math.max(...prices) + 0.3;

  // Map data → SVG coordinates
  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * chartW,
    y: PAD.top + (1 - (d.price - minP) / (maxP - minP)) * chartH,
    ...d,
  }));

  // Build SVG path
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Area fill path (close below)
  const areaPath = linePath + ` L${pts[pts.length - 1].x},${PAD.top + chartH} L${pts[0].x},${PAD.top + chartH} Z`;

  // Y-axis labels
  const yLabels = 4;
  const ySteps = Array.from({ length: yLabels + 1 }, (_, i) => minP + ((maxP - minP) * i) / yLabels);

  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block" }} onMouseLeave={() => setTooltip(null)}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {ySteps.map((v, i) => {
          const y = PAD.top + (1 - (v - minP) / (maxP - minP)) * chartH;
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
              <text x={PAD.left - 6} y={y + 4} fontSize="10" fill="var(--text-tertiary)" textAnchor="end" fontFamily="var(--font-sans)">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#grad-${color})`} />

        {/* Animated line */}
        <motion.path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }} />

        {/* Data points + hover targets */}
        {pts.map((p, i) => (
          <g key={i}>
            {/* Invisible wide hit area */}
            <rect x={p.x - chartW / (data.length * 2)} y={PAD.top} width={chartW / data.length} height={chartH} fill="transparent" onMouseEnter={() => setTooltip(p)} />
            {/* Visible dot */}
            <motion.circle cx={p.x} cy={p.y} r={tooltip?.month === p.month ? 5 : 3} fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.03, type: "spring", stiffness: 400 }} />
          </g>
        ))}

        {/* X-axis labels — every other label to avoid crowding */}
        {pts.map(
          (p, i) =>
            i % 2 === 0 && (
              <text key={i} x={p.x} y={H - 6} fontSize="10" fill="var(--text-tertiary)" textAnchor="middle" fontFamily="var(--font-sans)">
                {p.month}
              </text>
            ),
        )}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke={color} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
            <rect x={Math.min(tooltip.x - 28, W - 80)} y={tooltip.y - 32} width={70} height={24} rx={6} fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="1" />
            <text x={Math.min(tooltip.x - 28, W - 80) + 35} y={tooltip.y - 16} fontSize="11" fontWeight="600" fill="var(--text-primary)" textAnchor="middle" fontFamily="var(--font-sans)">
              {tooltip.price.toFixed(2)} kr
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ── Stat strip ────────────────────────────────────────────────────────────
function StatStrip({ data }) {
  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const latest = prices[prices.length - 1];
  const prev = prices[prices.length - 2];
  const change = latest - prev;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: "1rem" }}>
      {[
        { label: "12-month low", value: min.toFixed(2) + " kr", color: "var(--green)" },
        { label: "Latest", value: latest.toFixed(2) + " kr", color: "var(--text-primary)", delta: change },
        { label: "12-month high", value: max.toFixed(2) + " kr", color: "var(--red)" },
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
          <div style={{ fontSize: 16, fontWeight: 600, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          {s.delta != null && (
            <div style={{ fontSize: 11, color: s.delta >= 0 ? "var(--red)" : "var(--green)", marginTop: 2 }}>
              {s.delta >= 0 ? "+" : ""}
              {s.delta.toFixed(2)} kr vs last month
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── HistoryTab ────────────────────────────────────────────────────────────
// Usage: <HistoryTab />

export default function HistoryTab() {
  const [fuel, setFuel] = useState("benzin95");
  const data = HISTORY[fuel];
  const color = fuel === "benzin95" ? "#D97706" : "#2563EB";

  return (
    <div>
      {/* Fuel selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
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

      {/* Stats */}
      <StatStrip data={data} />

      {/* Chart card */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem 1.1rem",
          marginBottom: "0.9rem",
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
          {fuel === "benzin95" ? "Benzin 95" : "Diesel"} · 12-month trend · kr/L
        </div>
        <LineChart key={fuel} data={data} color={color} />
      </div>

      {/* Source note */}
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "right" }}>Historical data: EU Oil Bulletin · DK national averages</div>
    </div>
  );
}

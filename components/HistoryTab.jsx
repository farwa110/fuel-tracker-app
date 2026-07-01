// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";

// const HISTORY = {
//   benzin95: [
//     { month: "Maj 24", price: 14.85 },
//     { month: "Jun", price: 15.1 },
//     { month: "Jul", price: 15.42 },
//     { month: "Aug", price: 15.68 },
//     { month: "Sep", price: 15.31 },
//     { month: "Okt", price: 15.12 },
//     { month: "Nov", price: 14.98 },
//     { month: "Dec", price: 15.05 },
//     { month: "Jan 25", price: 15.41 },
//     { month: "Feb", price: 15.62 },
//     { month: "Mar", price: 15.78 },
//     { month: "Apr", price: 15.89 },
//   ],
//   diesel: [
//     { month: "Maj 24", price: 13.42 },
//     { month: "Jun", price: 13.68 },
//     { month: "Jul", price: 13.95 },
//     { month: "Aug", price: 14.12 },
//     { month: "Sep", price: 13.88 },
//     { month: "Okt", price: 13.72 },
//     { month: "Nov", price: 13.58 },
//     { month: "Dec", price: 13.65 },
//     { month: "Jan 25", price: 13.98 },
//     { month: "Feb", price: 14.12 },
//     { month: "Mar", price: 14.28 },
//     { month: "Apr", price: 14.42 },
//   ],
// };

// function LineChart({ data, color }) {
//   const W = 1000;
//   const H = 360;

//   const PAD = { top: 28, right: 28, bottom: 52, left: 64 };
//   const chartW = W - PAD.left - PAD.right;
//   const chartH = H - PAD.top - PAD.bottom;

//   const prices = data.map((d) => d.price);
//   const minP = Math.min(...prices) - 0.3;
//   const maxP = Math.max(...prices) + 0.3;

//   const pts = data.map((d, i) => ({
//     x: PAD.left + (i / (data.length - 1)) * chartW,
//     y: PAD.top + (1 - (d.price - minP) / (maxP - minP)) * chartH,
//     ...d,
//   }));

//   const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

//   const areaPath = linePath + ` L${pts[pts.length - 1].x},${PAD.top + chartH} L${pts[0].x},${PAD.top + chartH} Z`;

//   const ySteps = Array.from({ length: 5 }, (_, i) => minP + ((maxP - minP) * i) / 4);

//   const [tooltip, setTooltip] = useState(null);

//   return (
//     <div className="relative w-full overflow-x-auto">
//       <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" onMouseLeave={() => setTooltip(null)}>
//         <defs>
//           <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor={color} stopOpacity="0.2" />
//             <stop offset="100%" stopColor={color} stopOpacity="0" />
//           </linearGradient>
//         </defs>

//         {ySteps.map((v, i) => {
//           const y = PAD.top + (1 - (v - minP) / (maxP - minP)) * chartH;

//           return (
//             <g key={i}>
//               <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5" />
//               <text x={PAD.left - 10} y={y + 4} fontSize="12" fill="var(--text-tertiary)" textAnchor="end" fontFamily="var(--font-sans)">
//                 {v.toFixed(1)}
//               </text>
//             </g>
//           );
//         })}

//         <path d={areaPath} fill={`url(#grad-${color})`} />

//         <motion.path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }} />

//         {pts.map((p, i) => (
//           <g key={i}>
//             <rect x={p.x - chartW / (data.length * 2)} y={PAD.top} width={chartW / data.length} height={chartH} fill="transparent" onMouseEnter={() => setTooltip(p)} />

//             <motion.circle
//               cx={p.x}
//               cy={p.y}
//               r={tooltip?.month === p.month ? 7 : 4}
//               fill={color}
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{
//                 delay: 0.6 + i * 0.03,
//                 type: "spring",
//                 stiffness: 400,
//               }}
//             />
//           </g>
//         ))}

//         {pts.map((p, i) => (
//           <text key={i} x={p.x} y={H - 16} fontSize="12" fill="var(--text-tertiary)" textAnchor="middle" fontFamily="var(--font-sans)">
//             {p.month}
//           </text>
//         ))}

//         {tooltip && (
//           <g>
//             <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + chartH} stroke={color} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

//             <rect x={Math.min(tooltip.x - 42, W - 100)} y={tooltip.y - 44} width={86} height={32} rx={8} fill="var(--surface-raised)" stroke="var(--border)" />

//             <text x={Math.min(tooltip.x - 42, W - 100) + 43} y={tooltip.y - 24} fontSize="13" fontWeight="700" fill="var(--text-primary)" textAnchor="middle" fontFamily="var(--font-sans)">
//               {tooltip.price.toFixed(2)} kr
//             </text>
//           </g>
//         )}
//       </svg>
//     </div>
//   );
// }

// function StatStrip({ data }) {
//   const prices = data.map((d) => d.price);
//   const min = Math.min(...prices);
//   const max = Math.max(...prices);
//   const latest = prices[prices.length - 1];
//   const prev = prices[prices.length - 2];
//   const change = latest - prev;

//   const stats = [
//     {
//       label: "12-month low",
//       value: `${min.toFixed(2)} kr`,
//       color: "var(--green)",
//     },
//     {
//       label: "Latest",
//       value: `${latest.toFixed(2)} kr`,
//       color: "var(--text-primary)",
//       delta: change,
//     },
//     {
//       label: "12-month high",
//       value: `${max.toFixed(2)} kr`,
//       color: "var(--red)",
//     },
//   ];

//   return (
//     <div className="mb-6 grid gap-4 sm:grid-cols-3">
//       {stats.map((s, i) => (
//         <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
//           <div className="text-xs font-medium text-[var(--text-secondary)]">{s.label}</div>

//           <div className="mt-2 text-2xl font-bold tabular-nums tracking-[-0.04em]" style={{ color: s.color }}>
//             {s.value}
//           </div>

//           {s.delta != null && (
//             <div className="mt-1 text-xs" style={{ color: s.delta >= 0 ? "var(--red)" : "var(--green)" }}>
//               {s.delta >= 0 ? "+" : ""}
//               {s.delta.toFixed(2)} kr vs last month
//             </div>
//           )}
//         </motion.div>
//       ))}
//     </div>
//   );
// }

// export default function HistoryTab() {
//   const [fuel, setFuel] = useState("benzin95");
//   const data = HISTORY[fuel];
//   const color = fuel === "benzin95" ? "#D97706" : "#2563EB";

//   return (
//     <div className="w-full">
//       <div className="mb-5 flex flex-wrap gap-2">
//         {[
//           { id: "benzin95", label: "Benzin 95" },
//           { id: "diesel", label: "Diesel" },
//         ].map((f) => (
//           <motion.button
//             key={f.id}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setFuel(f.id)}
//             className="rounded-full border px-4 py-2 text-sm font-medium transition"
//             style={{
//               borderColor: fuel === f.id ? "var(--accent-border)" : "var(--border)",
//               background: fuel === f.id ? "var(--accent-dim)" : "transparent",
//               color: fuel === f.id ? "var(--accent)" : "var(--text-secondary)",
//             }}
//           >
//             {f.label}
//           </motion.button>
//         ))}
//       </div>

//       <StatStrip data={data} />

//       <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
//         <div className="mb-5">
//           <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{fuel === "benzin95" ? "Benzin 95" : "Diesel"} price trend</h2>

//           <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">12-month trend · kr/L</p>
//         </div>

//         <LineChart key={fuel} data={data} color={color} />
//       </div>

//       <p className="mt-3 text-right text-xs text-[var(--text-tertiary)]">Historical data: EU Oil Bulletin · DK national averages</p>
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const HISTORY = {
  benzin95: {
    Denmark: [14.85, 15.1, 15.42, 15.68, 15.31, 15.12, 14.98, 15.05, 15.41, 15.62, 15.78, 15.89],
    Germany: [13.95, 14.15, 14.45, 14.62, 14.38, 14.22, 14.08, 14.15, 14.52, 14.86, 15.05, 15.12],
    Sweden: [14.25, 14.52, 14.84, 15.05, 14.82, 14.62, 14.45, 14.52, 14.9, 15.28, 15.52, 15.62],
    Netherlands: [14.88, 15.12, 15.45, 15.72, 15.42, 15.2, 15.0, 15.1, 15.52, 15.95, 16.15, 16.35],
    Norway: [15.78, 16.0, 16.28, 16.42, 16.15, 15.98, 15.85, 15.92, 16.22, 16.5, 16.65, 16.78],
  },
  diesel: {
    Denmark: [13.42, 13.68, 13.95, 14.12, 13.88, 13.72, 13.58, 13.65, 13.98, 14.12, 14.28, 14.42],
    Germany: [13.25, 13.44, 13.65, 13.82, 13.6, 13.48, 13.35, 13.42, 13.72, 13.9, 14.02, 14.12],
    Sweden: [13.72, 13.95, 14.18, 14.35, 14.1, 13.92, 13.78, 13.86, 14.1, 14.34, 14.52, 14.68],
    Netherlands: [13.88, 14.1, 14.38, 14.58, 14.32, 14.15, 13.98, 14.06, 14.35, 14.62, 14.8, 14.95],
    Norway: [14.18, 14.45, 14.72, 14.9, 14.65, 14.42, 14.25, 14.34, 14.72, 15.0, 15.2, 15.35],
  },
};

const MONTHS = ["Maj 24", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec", "Jan 25", "Feb", "Mar", "Apr"];

const COUNTRIES = [
  { name: "Denmark", color: "var(--green)", flag: "🇩🇰" },
  { name: "Germany", color: "#2563eb", flag: "🇩🇪" },
  { name: "Sweden", color: "#8b5cf6", flag: "🇸🇪" },
  { name: "Netherlands", color: "#f97316", flag: "🇳🇱" },
  { name: "Norway", color: "#ef4444", flag: "🇳🇴" },
];

function MultiLineChart({ dataset }) {
  const W = 1100;
  const H = 430;
  const PAD = { top: 32, right: 90, bottom: 54, left: 58 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allPrices = Object.values(dataset).flat();
  const minP = Math.min(...allPrices) - 0.35;
  const maxP = Math.max(...allPrices) + 0.35;

  const ySteps = Array.from({ length: 6 }, (_, i) => minP + ((maxP - minP) * i) / 5);

  const getPoint = (price, i) => ({
    x: PAD.left + (i / (MONTHS.length - 1)) * chartW,
    y: PAD.top + (1 - (price - minP) / (maxP - minP)) * chartH,
  });

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
        {ySteps.map((v, i) => {
          const y = PAD.top + (1 - (v - minP) / (maxP - minP)) * chartH;

          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="var(--border)" strokeDasharray="5,5" />
              <text x={PAD.left - 10} y={y + 4} fontSize="12" fill="var(--text-tertiary)" textAnchor="end">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}

        {COUNTRIES.map((country) => {
          const values = dataset[country.name];
          const points = values.map(getPoint);
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
          const last = points[points.length - 1];
          const latest = values[values.length - 1];

          return (
            <g key={country.name}>
              <motion.path d={path} fill="none" stroke={country.color} strokeWidth={country.name === "Denmark" ? 3.5 : 2.5} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.1 }} />

              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={country.name === "Denmark" ? 4.5 : 3.8} fill={country.color} />
              ))}

              <rect x={last.x + 12} y={last.y - 15} width="66" height="28" rx="8" fill="var(--surface)" stroke={country.color} />
              <text x={last.x + 45} y={last.y + 4} fontSize="13" fontWeight="700" fill={country.color} textAnchor="middle">
                {latest.toFixed(2)}
              </text>
            </g>
          );
        })}

        {MONTHS.map((month, i) => {
          const x = PAD.left + (i / (MONTHS.length - 1)) * chartW;
          return (
            <text key={month} x={x} y={H - 18} fontSize="12" fill="var(--text-tertiary)" textAnchor="middle">
              {month}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function StatCards({ dataset }) {
  const latestEntries = COUNTRIES.map((c) => ({
    ...c,
    latest: dataset[c.name].at(-1),
    previous: dataset[c.name].at(-2),
    min: Math.min(...dataset[c.name]),
    max: Math.max(...dataset[c.name]),
  }));

  const allLatest = latestEntries.map((c) => c.latest);
  const lowest = latestEntries.find((c) => c.latest === Math.min(...allLatest));
  const highest = latestEntries.find((c) => c.latest === Math.max(...allLatest));
  const denmark = latestEntries.find((c) => c.name === "Denmark");

  const denmarkRank = [...latestEntries].sort((a, b) => a.latest - b.latest).findIndex((c) => c.name === "Denmark") + 1;

  const cards = [
    { label: "Lowest now", value: `${lowest.latest.toFixed(2)} kr`, sub: `${lowest.flag} ${lowest.name}`, color: "var(--green)" },
    { label: "Denmark latest", value: `${denmark.latest.toFixed(2)} kr`, sub: `${(denmark.latest - denmark.previous).toFixed(2)} kr vs last month`, color: "var(--text-primary)" },
    { label: "Highest now", value: `${highest.latest.toFixed(2)} kr`, sub: `${highest.flag} ${highest.name}`, color: "var(--red)" },
    { label: "Denmark rank", value: `${denmarkRank} / ${latestEntries.length}`, sub: "among selected countries", color: "var(--text-primary)" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card, i) => (
        <motion.article key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <p className="text-xs font-medium text-[var(--text-secondary)]">{card.label}</p>
          <p className="mt-3 text-3xl font-bold tabular-nums tracking-[-0.05em]" style={{ color: card.color }}>
            {card.value}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{card.sub}</p>
        </motion.article>
      ))}
    </div>
  );
}

function LatestTable({ dataset }) {
  const rows = COUNTRIES.map((country) => {
    const values = dataset[country.name];
    return {
      ...country,
      latest: values.at(-1),
      previous: values.at(-2),
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }).sort((a, b) => b.latest - a.latest);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Latest prices</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Average price in DKK per liter</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
        {rows.map((row) => {
          const change = row.latest - row.previous;

          return (
            <div key={row.name} className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[var(--border)] px-4 py-4 last:border-b-0 ${row.name === "Denmark" ? "bg-[var(--green-dim)]" : "bg-[var(--surface)]"}`}>
              <div className="font-medium text-[var(--text-primary)]">
                <span className="mr-2">{row.flag}</span>
                {row.name}
              </div>

              <div className="font-bold tabular-nums" style={{ color: row.color }}>
                {row.latest.toFixed(2)} kr
              </div>

              <div className="text-sm text-[var(--red)]">+{change.toFixed(2)} kr</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HistoryTab() {
  const [fuel, setFuel] = useState("benzin95");
  const dataset = useMemo(() => HISTORY[fuel], [fuel]);

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)]">Fuel price history</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Compare Denmark against selected European countries.</p>
        </div>

        <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
          <option value="benzin95">Benzin 95</option>
          <option value="diesel">Diesel</option>
        </select>
      </div>

      <StatCards dataset={dataset} />

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Price trend over the last 12 months</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Average fuel price in kr/L.</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
            {COUNTRIES.map((c) => (
              <span key={c.name}>
                <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        <MultiLineChart dataset={dataset} />
      </div>

      <div className="mt-6">
        <LatestTable dataset={dataset} />
      </div>

      <p className="mt-4 text-center text-xs text-[var(--text-tertiary)]">Source: EU Oil Bulletin · National averages · Prices shown in DKK per liter</p>
    </div>
  );
}

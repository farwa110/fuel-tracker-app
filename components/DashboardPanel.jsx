"use client";

import { motion } from "framer-motion";

export default function DashboardPanel({ title, subtitle, children, action }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="
        rounded-[var(--radius-lg)]
        border border-[var(--border)]
        bg-[var(--surface)]
        p-4 shadow-[var(--shadow-sm)]
        sm:p-5
      "
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{title}</h2>

          {subtitle && <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">{subtitle}</p>}
        </div>

        {action}
      </div>

      {children}
    </motion.section>
  );
}

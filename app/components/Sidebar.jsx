"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPinned, Building2, History, Star } from "lucide-react";

const navItems = [
  { id: "nearby", label: "Nearby", icon: MapPinned },
  { id: "cities", label: "Cities", icon: Building2 },
  { id: "history", label: "History", icon: History },
  { id: "favorites", label: "Favorites", icon: Star },
];

export default function Sidebar({ activeTab = "nearby", onTabChange, updatedAt }) {
  return (
    <aside
      className="
        fixed left-0 top-0 z-50 hidden h-dvh w-60
        border-r border-[var(--border)]
        bg-[color-mix(in_srgb,var(--bg)_90%,transparent)]
        px-5 py-5 backdrop-blur-xl
        lg:flex lg:flex-col
      "
    >
      <div className="pb-8">
        <div className="flex items-start gap-2.5 px-1">
          <div className="relative -mt-1 h-[58px] w-[58px] shrink-0">
            <Image src="/petrol-logo.png" alt="Fuelprice Tracker DK logo" fill className="object-contain" priority />
          </div>

          <div className="min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[20px] font-extrabold leading-none text-[var(--text-primary)]">Fuelprice</h1>

              <span className="rounded-md bg-[#1b1b1d] px-1.5 py-0.5 text-[8px] font-bold tracking-[0.12em] text-white">DK</span>
            </div>

            <div className="mt-[5px] pl-px text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c99a3a]">TRACKER</div>

            {updatedAt && (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                <span>
                  Updated{" "}
                  {new Date(updatedAt).toLocaleTimeString("da-DK", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="mt-10 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex w-full items-center gap-3 rounded-2xl px-4 py-3
                text-left text-sm font-medium transition
                ${isActive ? "bg-[#1f1f1f] text-white shadow-[var(--shadow-md)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"}
              `}
            >
              <span
                className={`
                  flex h-8 w-8 items-center justify-center rounded-xl
                  ${isActive ? "bg-white/10 text-[#c99a3a]" : "bg-[var(--surface)] text-[var(--text-secondary)]"}
                `}
              >
                <Icon size={16} strokeWidth={2.2} />
              </span>

              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MapPinned, Building2, History, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "nearby", label: "Nearby", icon: MapPinned },
  { id: "cities", label: "Cities", icon: Building2 },
  { id: "history", label: "History", icon: History },
  { id: "favorites", label: "Favorites", icon: Star },
];

export default function MobileNav({ activeTab = "nearby", onTabChange, updatedAt }) {
  const [open, setOpen] = useState(false);

  const handleClick = (id) => {
    onTabChange?.(id);
    setOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-(--border) bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-grey.png" alt="Fuelprice Tracker DK logo" width={44} height={44} priority />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-(--text-primary)">Fuelprice</span>
              <span className="rounded bg-[#1b1b1d] px-1.5 py-0.5 text-[9px] font-bold text-white">DK</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--text-secondary)">Tracker</p>
          </div>
        </Link>

        <button onClick={() => setOpen((prev) => !prev)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--surface-raised) text-(--text-primary) shadow-(--shadow-md)" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="mt-4 space-y-2 rounded-3xl border border-(--border) bg-(--surface-raised) p-3 shadow-(--shadow-md)">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button key={item.id} onClick={() => handleClick(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${isActive ? "bg-(--surface-hover) text-(--text-primary)" : "text-(--text-secondary)"}`}>
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}

            {updatedAt && (
              <p className="px-4 pb-2 pt-1 text-[11px] text-(--text-secondary)">
                ● Updated{" "}
                {new Date(updatedAt).toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

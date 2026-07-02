"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
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
    border-r border-(--border)
  bg-[color-mix(in_srgb,var(--bg)_92%,transparent)]
    px-5 py-5 backdrop-blur-2xl
    lg:flex lg:flex-col
  "
    >
      <div className="pb-8">
        <div className="flex items-start gap-3.5 px-1">
          {/* Logo — tall to match two-line text height */}

          {/* <div className="shrink-0 w-10 h-16 overflow-hidden flex items-center justify-center">
            <Image src="/logo-grey.png" href="/" alt="Fuelprice Tracker DK logo" width={80} height={80} className="object-contain scale-[2.2] translate-y-1" priority />
          </div> */}
          <Link href="/">
            <Image src="/logo-grey.png" alt="Fuelprice Tracker DK logo" width={80} height={80} className="object-contain scale-[2.2] translate-y-1" priority />
          </Link>
          {/* Text */}
          <div className="flex flex-col pt-0.5">
            {/* Title + Badge */}
            <div className="flex items-center gap-2 leading-none">
              <h1 className="text-[20px] font-medium tracking-tight text-(--text-primary)">Fuelprice</h1>
              <span className="bg-[#1b1b1d] text-white text-[9px] font-bold tracking-[0.12em] px-1.5 py-0.5 rounded-[5px] leading-none">DK</span>
            </div>

            {/* Subtitle */}
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-(--text-secondary)">Tracker</div>

            {/* Updated at */}
            {updatedAt && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-(--text-secondary)">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
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
                ${isActive ? "bg-(--surface-raised) text-(--text-primary) shadow-(--shadow-md)" : "text-(--text-secondary) hover:bg-(--surface-hover) hover:text-(--text-primary)"}
              `}
            >
              {/* <span
                className={`
                  flex h-8 w-8 items-center justify-center rounded-xl
                  ${isActive ? "bg-white/8 text-(--text-primary)" : "bg-(--surface) text-(--text-secondary)"}
                `}
              > */}
              <span
                className={`
    flex h-8 w-8 items-center justify-center rounded-xl
    ${isActive ? "bg-white/8 text-(--text-primary)" : "bg-(--surface) text-(--text-secondary)"}
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

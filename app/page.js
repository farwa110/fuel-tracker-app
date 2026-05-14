"use client";

import Link from "next/link";
import HomeHeader from "./components/HomeHeader";
import { useTheme } from "./components/ThemeProvider";

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <HomeHeader />

      <main
        className={`
    relative overflow-hidden min-h-screen
    ${theme === "dark" ? "bg-neutral-950 text-white" : "bg-[#f8f8f5] text-black"}
  `}
      >
        {/* SVG background */}
        <div
          className="
      absolute inset-0
      bg-[url('/fuel-tracker-topographic-bg.svg')]
      bg-cover bg-center bg-no-repeat
    "
        />

        {/* dark overlay */}
        {/* {theme === "dark" && <div className="absolute inset-0 bg-black/70" />} */}
        {theme === "dark" && <div className="absolute inset-0 bg-[#0b0b0d]/90" />}
        {/* <section className="min-h-[calc(100vh-4rem)] flex items-center px-8 md:px-20"> */}
        <section className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center px-8 md:px-20">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                className={`
                  uppercase tracking-[0.35em] mb-6
                  ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}
                `}
              >
                Fuel Tracking App
              </p>

              <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">Track fuel prices before you drive</h1>

              <p
                className={`
                  text-lg max-w-xl mb-10 leading-relaxed
                  ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}
                `}
              >
                Compare petrol and diesel prices, check nearby stations, and make smarter fuel choices in Denmark.
              </p>

              <Link
                href="/prices"
                className={`
                  inline-block rounded-full px-8 py-4 font-bold transition
                  ${theme === "dark" ? "bg-white text-black hover:bg-neutral-300" : "bg-black text-white hover:bg-neutral-800"}
                `}
              >
                See fuel prices
              </Link>
            </div>

            <Link href="/prices" className="group">
              <div
                className={`
                  mx-auto w-60 h-80 p-5 relative rounded-4xl
                  backdrop-blur-xl border shadow-2xl
                  hover:scale-[1.03] transition
                ${theme === "dark" ? "bg-[#18181b]/80 border-white/10 text-white" : "bg-white/30 border-white/50 text-black"}
                `}
              >
                <div
                  className={`
                    w-20 h-2 rounded-full mx-auto mb-8
                    ${theme === "dark" ? "bg-white/50" : "bg-black/50"}
                  `}
                />

                <div className="text-center">
                  <div className="text-6xl mb-4 grayscale">⛽</div>
                  <h2 className="text-xl font-black">Fuel Tracker</h2>
                </div>

                <div className="absolute bottom-5 left-5 right-5 space-y-3">
                  <div
                    className={`
                      flex justify-between rounded-xl p-3
                  ${theme === "dark" ? "bg-[#27272a] text-white" : "bg-white/60 text-black"}
                    `}
                  >
                    <span>Petrol 95</span>
                    <strong>14.79</strong>
                  </div>

                  <div
                    className={`
                      flex justify-between rounded-xl p-3
                       ${theme === "dark" ? "bg-[#27272a] text-white" : "bg-white/60 text-black"}
                    `}
                  >
                    <span>Diesel</span>
                    <strong>13.99</strong>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

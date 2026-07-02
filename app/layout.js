import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import { ReactQueryProvider } from "../components/ReactQueryProvider";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Fuelprice Tracker DK",
  description: "Live fuel prices across Denmark — find the cheapest station near you",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} bg-[color-mix(in_srgb,var(--bg)_90%,transparent)]`}>
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

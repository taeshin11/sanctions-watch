import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AdHeader from "@/components/ads/AdHeader";
import AdMobileSticky from "@/components/ads/AdMobileSticky";
import VisitorCounter from "@/components/VisitorCounter";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanctions Watch — Global Sanctions Tracker 2026",
  description: "Complete tracker for international sanctions. Search by country, issuer (OFAC, EU, UK, UN), and sector.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <AdHeader />
        <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
            Sanctions Watch
          </Link>
          <nav className="flex gap-4 text-sm text-gray-400 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/timeline" className="hover:text-white">Timeline</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </nav>
          <VisitorCounter />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
          Sanctions Watch © 2026 — Data from OFAC, European Council, UK FCDO, and UN Security Council
        </footer>
        <AdMobileSticky />
      </body>
    </html>
  );
}

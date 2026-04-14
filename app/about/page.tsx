import type { Metadata } from "next";
export const metadata: Metadata = { title: "About — Sanctions Watch", description: "About Sanctions Watch and data sources." };
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-4">About Sanctions Watch</h1>
      <div className="space-y-4 text-gray-300">
        <p>Sanctions Watch aggregates international sanctions data from four major sanctions regimes: US OFAC, EU, UK FCDO, and the UN Security Council.</p>
        <h2 className="text-lg font-semibold text-white mt-6">Data Sources</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong className="text-blue-400">US-OFAC</strong> — Office of Foreign Assets Control, US Treasury</li>
          <li><strong className="text-yellow-400">EU</strong> — European Council sanctions regulations</li>
          <li><strong className="text-red-400">UK</strong> — Foreign, Commonwealth & Development Office (FCDO)</li>
          <li><strong className="text-gray-400">UN</strong> — UN Security Council Sanctions Committees</li>
        </ul>
        <p className="text-gray-400 text-sm mt-6">Last updated: April 2026. For legal compliance, consult official government sources.</p>
      </div>
    </div>
  );
}

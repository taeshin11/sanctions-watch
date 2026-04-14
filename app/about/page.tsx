import type { Metadata } from "next";
export const metadata: Metadata = { title: "About — Sanctions Watch", description: "About Sanctions Watch and data sources." };
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">About Sanctions Watch</h1>
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">Sanctions Watch aggregates international sanctions data from four major sanctions regimes: US OFAC, EU, UK FCDO, and the UN Security Council.</p>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Data Sources</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-500/20 mt-0.5 shrink-0">US-OFAC</span>
              <span className="text-slate-600">Office of Foreign Assets Control, US Treasury</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20 mt-0.5 shrink-0">EU</span>
              <span className="text-slate-600">European Council sanctions regulations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/20 mt-0.5 shrink-0">UK</span>
              <span className="text-slate-600">Foreign, Commonwealth & Development Office (FCDO)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/20 mt-0.5 shrink-0">UN</span>
              <span className="text-slate-600">UN Security Council Sanctions Committees</span>
            </li>
          </ul>
        </div>

        <p className="text-slate-400 text-sm">Last updated: April 2026. For legal compliance, consult official government sources.</p>
      </div>
    </div>
  );
}

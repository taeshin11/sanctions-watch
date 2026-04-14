import { promises as fs } from "fs";
import path from "path";
import SanctionsTable from "@/components/SanctionsTable";
import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server'

export const metadata: Metadata = {
  title: "Sanctions Timeline 2026 — Sanctions Watch",
  description: "Chronological list of all international sanctions from OFAC, EU, UK, and UN.",
};

type SanctionRecord = {
  id: string; date: string; issuer: string;
  target_country: string; target_country_label: string; target_country_flag: string;
  entity: string; entity_type: string; sector: string; type: string;
  description: string; legal_basis: string; source: string;
};

export default async function TimelinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const raw = await fs.readFile(path.join(process.cwd(), "public/data/sanctions.json"), "utf-8");
  const records: SanctionRecord[] = JSON.parse(raw).records;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Sanctions Timeline</h1>
      <p className="text-slate-500 mb-6">All {sorted.length} records, newest first</p>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Sanctions Records</h2>
          <span className="text-sm text-slate-500">{sorted.length} records</span>
        </div>
        <SanctionsTable records={sorted} />
      </div>
    </div>
  );
}

import { promises as fs } from "fs";
import path from "path";
import SanctionsTable from "@/components/SanctionsTable";
import type { Metadata } from "next";

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

export default async function TimelinePage() {
  const raw = await fs.readFile(path.join(process.cwd(), "public/data/sanctions.json"), "utf-8");
  const records: SanctionRecord[] = JSON.parse(raw).records;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Sanctions Timeline</h1>
      <p className="text-gray-400 mb-6">All {sorted.length} records, newest first</p>
      <SanctionsTable records={sorted} />
    </div>
  );
}

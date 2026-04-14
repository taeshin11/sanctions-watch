import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

type SanctionRecord = {
  id: string; date: string; issuer: string;
  target_country: string; target_country_label: string; target_country_flag: string;
  entity: string; entity_type: string; sector: string; type: string;
  description: string; legal_basis: string; source: string;
};

async function getRecords(): Promise<SanctionRecord[]> {
  const raw = await fs.readFile(path.join(process.cwd(), "public/data/sanctions.json"), "utf-8");
  return JSON.parse(raw).records;
}

export async function generateStaticParams() {
  const records = await getRecords();
  const sectors = [...new Set(records.map((r) => r.sector))];
  return routing.locales.flatMap(locale => sectors.map(slug => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} Sanctions 2026 — Sanctions Watch`,
    description: `All sanctions targeting the ${slug.replace(/-/g, " ")} sector.`,
  };
}

export default async function SectorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale)

  const records = await getRecords();
  const sectorRecords = records.filter((r) => r.sector === slug);
  if (sectorRecords.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href={`/${locale}`} className="text-sm text-violet-600 hover:text-violet-700 font-medium mb-6 inline-flex items-center gap-1">← All Sanctions</Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-2 capitalize">{slug.replace(/-/g, " ")} Sector Sanctions</h1>
      <p className="text-slate-500 text-sm mb-6">{sectorRecords.length} records</p>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Sanctions Records</h2>
          <span className="text-sm text-slate-500">{sectorRecords.length} records</span>
        </div>
        <SanctionsTable records={sectorRecords} />
      </div>
    </div>
  );
}

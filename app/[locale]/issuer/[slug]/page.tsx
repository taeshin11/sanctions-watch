import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import IssuerBadge from "@/components/IssuerBadge";
import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

const ISSUER_MAP: Record<string, string> = {
  "us-ofac": "US-OFAC",
  "eu": "EU",
  "uk": "UK",
  "un": "UN",
};

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
  return routing.locales.flatMap(locale =>
    Object.keys(ISSUER_MAP).map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const issuer = ISSUER_MAP[slug];
  if (!issuer) return {};
  return {
    title: `${issuer} Sanctions 2026 — Sanctions Watch`,
    description: `All sanctions issued by ${issuer} tracked on Sanctions Watch.`,
  };
}

export default async function IssuerPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale)

  const issuer = ISSUER_MAP[slug];
  if (!issuer) notFound();

  const records = await getRecords();
  const issuerRecords = records.filter((r) => r.issuer === issuer);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href={`/${locale}`} className="text-sm text-violet-600 hover:text-violet-700 font-medium mb-6 inline-flex items-center gap-1">← All Sanctions</Link>
      <div className="flex items-center gap-3 mb-6">
        <IssuerBadge issuer={issuer} />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{issuer} Sanctions</h1>
          <p className="text-slate-500 text-sm mt-1">{issuerRecords.length} records</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Sanctions Records</h2>
          <span className="text-sm text-slate-500">{issuerRecords.length} records</span>
        </div>
        <SanctionsTable records={issuerRecords} />
      </div>
    </div>
  );
}

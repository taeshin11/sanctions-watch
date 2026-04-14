import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import IssuerBadge from "@/components/IssuerBadge";
import type { Metadata } from "next";

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
  return Object.keys(ISSUER_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/issuer/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const issuer = ISSUER_MAP[slug];
  if (!issuer) return {};
  return {
    title: `${issuer} Sanctions 2026 — Sanctions Watch`,
    description: `All sanctions issued by ${issuer} tracked on Sanctions Watch.`,
  };
}

export default async function IssuerPage(props: PageProps<"/issuer/[slug]">) {
  const { slug } = await props.params;
  const issuer = ISSUER_MAP[slug];
  if (!issuer) notFound();

  const records = await getRecords();
  const issuerRecords = records.filter((r) => r.issuer === issuer);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">← All Sanctions</Link>
      <div className="flex items-center gap-3 mb-6">
        <IssuerBadge issuer={issuer} />
        <div>
          <h1 className="text-3xl font-bold text-white">{issuer} Sanctions</h1>
          <p className="text-gray-400 text-sm mt-1">{issuerRecords.length} records</p>
        </div>
      </div>
      <SanctionsTable records={issuerRecords} />
    </div>
  );
}

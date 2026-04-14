import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import type { Metadata } from "next";

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
  return sectors.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/sector/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `${slug.replace(/-/g, " ")} Sanctions 2026 — Sanctions Watch`,
    description: `All sanctions targeting the ${slug.replace(/-/g, " ")} sector.`,
  };
}

export default async function SectorPage(props: PageProps<"/sector/[slug]">) {
  const { slug } = await props.params;
  const records = await getRecords();
  const sectorRecords = records.filter((r) => r.sector === slug);
  if (sectorRecords.length === 0) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">← All Sanctions</Link>
      <h1 className="text-3xl font-bold text-white mb-2 capitalize">{slug.replace(/-/g, " ")} Sector Sanctions</h1>
      <p className="text-gray-400 text-sm mb-6">{sectorRecords.length} records</p>
      <SanctionsTable records={sectorRecords} />
    </div>
  );
}

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
  const slugs = [...new Set(records.map((r) => r.target_country))];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/country/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const records = await getRecords();
  const r = records.find((x) => x.target_country === slug);
  if (!r) return {};
  return {
    title: `${r.target_country_label} Sanctions List 2026 — Complete Tracker | Sanctions Watch`,
    description: `All international sanctions against ${r.target_country_label} from OFAC, EU, UK FCDO, and UN Security Council.`,
  };
}

export default async function CountryPage(props: PageProps<"/country/[slug]">) {
  const { slug } = await props.params;
  const records = await getRecords();
  const countryRecords = records.filter((r) => r.target_country === slug);
  if (countryRecords.length === 0) notFound();
  const first = countryRecords[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">← All Sanctions</Link>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{first.target_country_flag}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{first.target_country_label} Sanctions List</h1>
          <p className="text-gray-400 text-sm mt-1">{countryRecords.length} sanctions records</p>
        </div>
      </div>
      <SanctionsTable records={countryRecords} />
    </div>
  );
}

import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import IssuerBadge from "@/components/IssuerBadge";
import AdSidebar from "@/components/ads/AdSidebar";

type SanctionRecord = {
  id: string;
  date: string;
  issuer: string;
  target_country: string;
  target_country_label: string;
  target_country_flag: string;
  entity: string;
  entity_type: string;
  sector: string;
  type: string;
  description: string;
  legal_basis: string;
  source: string;
};

async function getRecords(): Promise<SanctionRecord[]> {
  const raw = await fs.readFile(path.join(process.cwd(), "public/data/sanctions.json"), "utf-8");
  return JSON.parse(raw).records;
}

export default async function Home() {
  const records = await getRecords();

  const byIssuer = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.issuer] = (acc[r.issuer] || 0) + 1;
    return acc;
  }, {});

  const byCountry = records.reduce<Record<string, { flag: string; label: string; count: number }>>((acc, r) => {
    if (!acc[r.target_country]) {
      acc[r.target_country] = { flag: r.target_country_flag, label: r.target_country_label, count: 0 };
    }
    acc[r.target_country].count++;
    return acc;
  }, {});

  const topCountries = Object.entries(byCountry)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  const recent = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sanctions Watch</h1>
        <p className="text-gray-400">Global sanctions tracker — {records.length} records from OFAC, EU, UK, and UN</p>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{records.length}</div>
              <div className="text-xs text-gray-400 mt-1">Total Sanctions</div>
            </div>
            {Object.entries(byIssuer).map(([issuer, count]) => (
              <Link key={issuer} href={`/issuer/${issuer.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="mt-1"><IssuerBadge issuer={issuer} /></div>
              </Link>
            ))}
          </div>

          {/* Recent records */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Sanctions</h2>
              <Link href="/timeline" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
            </div>
            <SanctionsTable records={recent} />
          </div>
        </div>

        <aside className="hidden lg:block w-[300px] shrink-0">
          <AdSidebar />
          <div className="mt-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3 text-sm">By Country</h3>
            {topCountries.map(([slug, d]) => (
              <Link key={slug} href={`/country/${slug}`}
                className="flex items-center justify-between py-1.5 text-sm hover:text-blue-400 transition-colors">
                <span className="text-gray-300">{d.flag} {d.label}</span>
                <span className="text-gray-500 text-xs">{d.count}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-3 text-sm">By Issuer</h3>
            {Object.entries(byIssuer).map(([issuer, count]) => (
              <Link key={issuer} href={`/issuer/${issuer.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className="flex items-center justify-between py-1.5 hover:text-blue-400 transition-colors">
                <IssuerBadge issuer={issuer} />
                <span className="text-gray-500 text-xs">{count}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

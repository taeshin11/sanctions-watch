import type { Metadata } from 'next'
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import SanctionsTable from "@/components/SanctionsTable";
import IssuerBadge from "@/components/IssuerBadge";
import AdSidebar from "@/components/ads/AdSidebar";

export const metadata: Metadata = {
  title: 'Sanctions Watch | Real-Time Conflict Intelligence',
  description: 'Comprehensive database of international sanctions, arms embargoes, and economic restrictions related to armed conflicts',
  keywords: 'sanctions tracker, economic sanctions, arms embargo, financial sanctions, sanctions database, OFAC',
}

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

  const russiaCount = byCountry["russia"]?.count || 0;
  const iranCount = byCountry["iran"]?.count || 0;
  const issuersCount = Object.keys(byIssuer).length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">B2B Compliance Reference</p>
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div>
              <h1 className="text-4xl font-extrabold mb-4">Sanctions Watch</h1>
              <p className="text-slate-300 text-lg max-w-2xl">Track international sanctions by country, sector, and issuing body. Free compliance reference.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-violet-400">{records.length}</div>
                <div className="text-xs text-slate-400 mt-1">Total Sanctions</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-violet-400">{Object.keys(byCountry).length}</div>
                <div className="text-xs text-slate-400 mt-1">Countries Targeted</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center">
                <div className="text-3xl font-black text-violet-400">{issuersCount}</div>
                <div className="text-xs text-slate-400 mt-1">Issuers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 text-center">
          <div className="text-3xl font-black text-slate-900">{records.length}</div>
          <div className="text-slate-500 text-sm mt-1">Total Sanctions</div>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-5 text-center text-white shadow-lg shadow-violet-500/25">
          <div className="text-3xl font-black">{russiaCount}</div>
          <div className="text-violet-100 text-sm mt-1">vs Russia</div>
        </div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-5 text-center text-white shadow-lg">
          <div className="text-3xl font-black">{iranCount}</div>
          <div className="text-slate-300 text-sm mt-1">vs Iran</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 text-center">
          <div className="text-3xl font-black text-slate-900">{issuersCount}</div>
          <div className="text-slate-500 text-sm mt-1">Issuing Bodies</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Main table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Recent Sanctions</h2>
                <Link href="/timeline" className="text-sm text-violet-600 font-semibold hover:text-violet-700">View all →</Link>
              </div>
              <SanctionsTable records={recent} />
            </div>
          </div>

          <aside className="hidden lg:block w-[300px] shrink-0">
            <AdSidebar />
            <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">By Country</h3>
              {topCountries.map(([slug, d]) => (
                <Link key={slug} href={`/country/${slug}`}
                  className="flex items-center justify-between py-2 text-sm hover:text-violet-600 transition-colors border-b border-slate-50 last:border-0">
                  <span className="text-slate-700">{d.flag} {d.label}</span>
                  <span className="text-slate-400 text-xs bg-slate-50 px-2 py-0.5 rounded-full">{d.count}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">By Issuer</h3>
              {Object.entries(byIssuer).map(([issuer, count]) => (
                <Link key={issuer} href={`/issuer/${issuer.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  className="flex items-center justify-between py-2 hover:opacity-80 transition-opacity border-b border-slate-50 last:border-0">
                  <IssuerBadge issuer={issuer} />
                  <span className="text-slate-400 text-xs bg-slate-50 px-2 py-0.5 rounded-full">{count}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

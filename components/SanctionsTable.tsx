"use client";

import { useState, useMemo } from "react";
import IssuerBadge from "./IssuerBadge";
import Link from "next/link";

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

const TYPE_STYLE: Record<string, string> = {
  "asset-freeze": "bg-violet-500/10 text-violet-700 ring-1 ring-inset ring-violet-500/20",
  "travel-ban": "bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-500/20",
  "trade-restriction": "bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-500/20",
  "arms-embargo": "bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/20",
};

function TypeBadge({ type }: { type: string }) {
  const style = TYPE_STYLE[type] || "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style}`}>
      {type}
    </span>
  );
}

export default function SanctionsTable({ records }: { records: SanctionRecord[] }) {
  const [search, setSearch] = useState("");
  const [issuerFilter, setIssuerFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const issuers = [...new Set(records.map((r) => r.issuer))].sort();
  const countries = [...new Set(records.map((r) => r.target_country))].sort();
  const sectors = [...new Set(records.map((r) => r.sector))].sort();

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (issuerFilter && r.issuer !== issuerFilter) return false;
      if (countryFilter && r.target_country !== countryFilter) return false;
      if (sectorFilter && r.sector !== sectorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.entity.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.target_country_label.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [records, search, issuerFilter, countryFilter, sectorFilter]);

  const selectClass = "text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 bg-white text-slate-700";

  return (
    <div>
      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${selectClass} flex-1 min-w-[180px]`}
        />
        <select value={issuerFilter} onChange={(e) => setIssuerFilter(e.target.value)} className={selectClass}>
          <option value="">All Issuers</option>
          {issuers.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className={selectClass}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} className={selectClass}>
          <option value="">All Sectors</option>
          {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="px-6 py-2 border-b border-slate-50">
        <span className="text-xs text-slate-400">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Issuer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Sector</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-violet-50/30 transition-colors">
                <td className="px-4 py-3.5 text-slate-500 text-xs font-mono whitespace-nowrap">{r.date}</td>
                <td className="px-4 py-3.5"><IssuerBadge issuer={r.issuer} /></td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Link href={`/country/${r.target_country}`} className="flex items-center gap-1.5 hover:text-violet-600 transition-colors">
                    <span className="text-base">{r.target_country_flag}</span>
                    <span className="font-medium text-slate-800">{r.target_country_label}</span>
                  </Link>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-900 max-w-[150px] truncate">{r.entity}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell">
                  <Link href={`/sector/${r.sector}`} className="hover:text-violet-600 transition-colors">
                    {r.sector}
                  </Link>
                </td>
                <td className="px-4 py-3.5"><TypeBadge type={r.type} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search entity, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 flex-1 min-w-[200px]"
        />
        <select
          value={issuerFilter}
          onChange={(e) => setIssuerFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Issuers</option>
          {issuers.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
        >
          <option value="">All Sectors</option>
          {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <p className="text-xs text-gray-400 mb-3">{filtered.length} results</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400 text-xs">
              <th className="pb-2 pr-3 font-medium">Date</th>
              <th className="pb-2 pr-3 font-medium">Issuer</th>
              <th className="pb-2 pr-3 font-medium">Target</th>
              <th className="pb-2 pr-3 font-medium">Entity</th>
              <th className="pb-2 pr-3 font-medium">Sector</th>
              <th className="pb-2 pr-3 font-medium">Type</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="py-2.5 pr-3 text-gray-400 whitespace-nowrap">{r.date}</td>
                <td className="py-2.5 pr-3"><IssuerBadge issuer={r.issuer} /></td>
                <td className="py-2.5 pr-3 whitespace-nowrap">
                  <Link href={`/country/${r.target_country}`} className="hover:text-blue-400 transition-colors">
                    {r.target_country_flag} {r.target_country_label}
                  </Link>
                </td>
                <td className="py-2.5 pr-3 text-white font-medium max-w-[150px] truncate">{r.entity}</td>
                <td className="py-2.5 pr-3">
                  <Link href={`/sector/${r.sector}`} className="text-gray-300 hover:text-blue-400 text-xs">
                    {r.sector}
                  </Link>
                </td>
                <td className="py-2.5 pr-3 text-gray-300 text-xs whitespace-nowrap">{r.type}</td>
                <td className="py-2.5 text-gray-400 text-xs max-w-[250px]">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

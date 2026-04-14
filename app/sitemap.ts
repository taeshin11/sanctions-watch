import type { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";

const BASE_URL = "https://sanctions-watch.vercel.app";
const LOCALES = ["en", "ar", "zh", "ru", "fr", "de", "es", "uk"];

type SanctionRecord = { target_country: string; issuer: string; sector: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const raw = await fs.readFile(path.join(process.cwd(), "public/data/sanctions.json"), "utf-8");
  const records: SanctionRecord[] = JSON.parse(raw).records;

  const countries = [...new Set(records.map((r) => r.target_country))];
  const sectors = [...new Set(records.map((r) => r.sector))];
  const issuers = ["us-ofac", "eu", "uk", "un"];

  const routes = [
    "", "/about", "/timeline",
    ...countries.map((c) => `/country/${c}`),
    ...issuers.map((i) => `/issuer/${i}`),
    ...sectors.map((s) => `/sector/${s}`),
  ];

  return LOCALES.flatMap((locale) =>
    routes.map((r) => ({
      url: `${BASE_URL}/${locale}${r}`,
      lastModified: new Date("2026-04-14"),
      changeFrequency: "weekly" as const,
      priority: r === "" ? 1 : 0.8,
    }))
  );
}

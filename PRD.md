# Sanctions Watch — PRD

> Short Title: International Sanctions Tracker for Active Conflict Regimes
> Last Updated: 2026-04-14

---

## Overview

Sanctions Watch is a public-facing, multilingual web application that tracks active international sanctions regimes imposed by major authorities (US OFAC, European Union, United Nations) against countries, entities, and individuals connected to active armed conflicts. The site aggregates and presents sanctions data in a clear, structured format — allowing journalists, researchers, policy analysts, NGOs, and curious citizens to quickly understand who is sanctioned, by whom, for what reason, and what the estimated economic impact is.

The site is statically generated (SSG) using Next.js 15 App Router, served via Vercel's free tier, and supports 8 languages via next-intl. All data is stored as flat JSON files in /public/data/ and updated manually or via automated scripts before each redeploy.

Live URL: https://sanctions-watch.vercel.app

---

## Target Users & Pain Points

| User Type | Pain Point | How This Solves It |
|---|---|---|
| Investigative journalists | Sanctions lists are scattered across OFAC, EU, and UN portals with inconsistent formats | Unified search and filter across all three regimes in one place |
| Policy researchers & analysts | Hard to track recent additions/removals without monitoring multiple official feeds | Timeline of recent sanctions additions with source attribution |
| Compliance officers (SMBs) | No free, simple tool to check if a country or entity is under active sanctions | Searchable entity index with regime labels and status badges |
| NGO workers & humanitarian orgs | Need to understand sanctions carve-outs and humanitarian exemptions | Context fields in data model explaining exemptions per regime |
| General public / students | Want to understand why a country is sanctioned and what the economic impact is | Plain-language summaries and economic impact estimates per regime |
| SEO-driven organic traffic | Users searching "russia sanctions list 2026" expect a clear, up-to-date page | Dedicated country and regime pages optimized for exact-match keywords |

---

## Tech Stack

- Framework: Next.js 15 (App Router, SSG)
- Styling: Tailwind CSS
- i18n: next-intl (8 languages: en / ko / ja / zh / es / fr / de / pt)
- Data: JSON files in /public/data/ (sanctions.json)
- Ads: Adsterra + Google AdSense ca-pub-7098271335538021
- Deployment: Vercel free tier
- Repo: GitHub (public)
- Analytics: Vercel Analytics (free tier)

---

## Pages & Routes

### App Router Structure

```
app/
  [locale]/
    layout.tsx              — Root layout with locale provider, header, footer, AdSense script
    page.tsx                — Homepage: hero, quick stats, recent sanctions, featured regimes
    loading.tsx             — Skeleton loader
    not-found.tsx           — 404 page
    sanctions/
      page.tsx              — Full sanctions list with search, filter by regime/country/date
      [entityId]/
        page.tsx            — Individual sanctioned entity detail page
    regimes/
      page.tsx              — Overview of all sanctions regimes (OFAC, EU, UN)
      [regimeSlug]/
        page.tsx            — Regime detail: description, total entities, recent additions
    countries/
      page.tsx              — Country index: all countries with active sanctions
      [countryCode]/
        page.tsx            — Country detail: which regimes target it, economic impact, timeline
    about/
      page.tsx              — About the project, data sources, update methodology
  api/
    sanctions/
      route.ts              — GET: returns full sanctions.json (or filtered subset)
    revalidate/
      route.ts              — POST: on-demand ISR trigger (protected by secret token)
```

### Key Page Descriptions

**Homepage (`/[locale]/`)**
- Hero banner with current count of active sanctioned entities
- "Recent Additions" feed: last 10 newly sanctioned entities with date and regime badge
- Quick stats bar: total entities, countries covered, regimes tracked, last updated timestamp
- Featured conflict cards (Russia/Ukraine, Iran, North Korea, Myanmar) linking to country pages
- Ad unit: leaderboard above fold, rectangle below recent additions

**Sanctions List (`/[locale]/sanctions/`)**
- Paginated table (50 per page) of all sanctioned entities
- Search bar: full-text search across entity name, aliases, reason field
- Filters: regime (OFAC / EU / UN / All), entity type (individual / organization / vessel / aircraft), country, date range
- Sort: by date added (default), by country, by regime
- Each row: entity name, type badge, country flag, regime badges, date added, detail link
- Ad unit: sticky sidebar rectangle on desktop, inline between page breaks on mobile

**Entity Detail (`/[locale]/sanctions/[entityId]/`)**
- Full entity card: official name, aliases, entity type, nationality
- Sanctions regime breakdown: which regimes apply, date each was added, reason/basis
- Linked individuals/organizations (associated entities)
- Humanitarian exemption notes (if any)
- Economic context: estimated asset freeze value (where available)
- Source attribution links (OFAC SDN list, EU Official Journal, UN Security Council resolution)
- Related entities section

**Regime Pages (`/[locale]/regimes/[regimeSlug]/`)**
- Regime overview: authority, legal basis, geographic scope
- Live stats: total active designations, countries targeted, recent additions count
- Recent additions timeline (last 30 days)
- Link to official source
- Download JSON button (filtered to this regime)

**Country Pages (`/[locale]/countries/[countryCode]/`)**
- Country header: flag, name, conflict context summary
- Regimes active against this country (badges)
- Economic impact estimates: GDP impact %, key sectors affected, trade partner effects
- Sanctions timeline: key dates (initial imposition, major expansions, any removals)
- Top sanctioned entities from this country
- Related conflict links (links to strike-signal, ukraine-frontline-tracker if applicable)

---

## Data Model (JSON schema)

### /public/data/sanctions.json

```json
{
  "meta": {
    "lastUpdated": "2026-04-14T00:00:00Z",
    "totalEntities": 12500,
    "regimes": ["OFAC", "EU", "UN"],
    "version": "1.0.0"
  },
  "entities": [
    {
      "id": "ofac-sdn-00001",
      "name": "Example Entity Name",
      "aliases": ["Alt Name 1", "Alt Name 2"],
      "entityType": "individual | organization | vessel | aircraft",
      "nationality": "RU",
      "countryCode": "RU",
      "regimes": [
        {
          "authority": "OFAC",
          "listName": "SDN",
          "dateAdded": "2022-02-28",
          "reason": "Designated for support of Russian military operations in Ukraine",
          "legalBasis": "Executive Order 14024",
          "sourceUrl": "https://ofac.treasury.gov/..."
        },
        {
          "authority": "EU",
          "listName": "Consolidated Sanctions List",
          "dateAdded": "2022-03-01",
          "reason": "...",
          "legalBasis": "Council Regulation (EU) No 269/2014",
          "sourceUrl": "https://eur-lex.europa.eu/..."
        }
      ],
      "economicImpact": {
        "estimatedAssetsfrozen": 500000000,
        "currency": "USD",
        "confidence": "low | medium | high"
      },
      "humanitarianExemption": false,
      "exemptionDetails": null,
      "relatedEntityIds": ["ofac-sdn-00002"],
      "lastVerified": "2026-04-14"
    }
  ],
  "regimes": [
    {
      "slug": "ofac",
      "name": "US OFAC (Office of Foreign Assets Control)",
      "authority": "United States Department of the Treasury",
      "legalBasis": "IEEPA, TWEA, and various Executive Orders",
      "officialUrl": "https://ofac.treasury.gov/",
      "totalDesignations": 5800,
      "lastUpdated": "2026-04-14"
    }
  ],
  "countries": [
    {
      "code": "RU",
      "name": "Russia",
      "conflictContext": "Full-scale invasion of Ukraine since February 2022",
      "activeRegimes": ["OFAC", "EU", "UN"],
      "economicImpact": {
        "gdpImpactPercent": -3.5,
        "keyAffectedSectors": ["energy", "finance", "defense", "technology"],
        "tradeVolumeReductionPercent": 40,
        "currencyDepreciationPercent": 25
      },
      "sanctionsTimeline": [
        {
          "date": "2022-02-22",
          "event": "First wave: OFAC sanctions on Russian banks and oligarchs"
        }
      ]
    }
  ]
}
```

---

## Milestones & Git Push Points

### M0 — Project Scaffold
- Next.js 15 project initialized with App Router
- Tailwind CSS configured
- next-intl installed, 8 locale folders created with base translation keys
- Folder structure created: app/[locale]/, app/api/, public/data/
- Empty sanctions.json placeholder committed
- Vercel project linked, first deploy succeeds
- Git push: `feat: scaffold Next.js 15 app with i18n and Tailwind`

### M1 — Data Layer
- sanctions.json populated with real data (minimum 500 entities across OFAC/EU/UN)
- Countries array populated (minimum 10 countries)
- Regimes array populated (3 regimes: OFAC, EU, UN)
- /api/sanctions/route.ts implemented (GET, optional ?regime= and ?country= query params)
- Data validation script written and passing
- Git push: `feat: populate sanctions data and API route`

### M2 — Homepage & Layout
- Root layout with header (logo, nav, language switcher), footer (about, sources, social links)
- AdSense script injected in layout.tsx
- Homepage hero with live stats from sanctions.json meta
- Recent additions feed (last 10 entities by dateAdded)
- Featured conflict cards (Russia, Iran, North Korea, Myanmar)
- Mobile-responsive layout verified
- Git push: `feat: homepage, layout, and AdSense integration`

### M3 — Sanctions List Page
- Paginated table with 50 entities per page
- Client-side search and filter (regime, entity type, country, date range)
- Sort controls
- Entity row component with badges
- Loading skeleton
- Git push: `feat: sanctions list page with search and filter`

### M4 — Detail Pages (Entity, Regime, Country)
- Entity detail page with full data display
- Regime detail pages (3 pages: OFAC, EU, UN)
- Country detail pages (dynamic, generated from countries array)
- generateStaticParams for all dynamic routes
- Git push: `feat: entity, regime, and country detail pages`

### M5 — i18n, SEO, Sitemap
- All 8 language translations completed for UI strings
- Metadata (title, description, og:image) set per page and locale
- sitemap.xml generated (all static + dynamic routes × 8 locales)
- robots.txt configured
- Canonical URLs set
- Structured data (JSON-LD: Dataset schema on homepage)
- Git push: `feat: i18n translations, SEO metadata, and sitemap`

### M6 — QA, Performance, Launch
- Lighthouse score ≥ 90 on Performance, Accessibility, SEO
- All 8 locales tested for layout breakage
- 404 and error pages verified
- Ad units verified rendering (Adsterra + AdSense)
- Vercel production deployment verified
- Google Search Console property registered, sitemap submitted
- Git push: `chore: QA pass and production launch`

---

## Agent Team

### Frontend Agent
**Responsibilities:**
- Build all React components (layout, tables, cards, badges, search/filter UI)
- Implement Tailwind CSS styling and responsive design
- Integrate next-intl for all UI string translations
- Implement client-side pagination and filtering
- Ensure Lighthouse performance score ≥ 90
- Add AdSense and Adsterra ad unit placements

**Key Files:**
- app/[locale]/layout.tsx
- app/[locale]/page.tsx
- app/[locale]/sanctions/page.tsx
- components/EntityRow.tsx, EntityCard.tsx, RegimeCard.tsx, CountryCard.tsx
- components/SearchFilter.tsx, Pagination.tsx

### Backend / Data Agent
**Responsibilities:**
- Populate and maintain public/data/sanctions.json
- Write data ingestion/normalization scripts (scraping OFAC SDN list, EU list, UN list)
- Implement /api/sanctions/route.ts with filtering
- Write JSON schema validation scripts
- Maintain data freshness (update before each redeploy)

**Key Files:**
- public/data/sanctions.json
- app/api/sanctions/route.ts
- scripts/fetch-ofac.js, scripts/fetch-eu.js, scripts/fetch-un.js
- scripts/validate-data.js

### SEO / Content Agent
**Responsibilities:**
- Write all page metadata (title tags, meta descriptions) for all 8 locales
- Generate sitemap.xml covering all routes × locales
- Write JSON-LD structured data for homepage and entity pages
- Write translation strings for all 8 languages (messages/en.json through messages/pt.json)
- Research and validate SEO keyword targeting
- Write about page content and data source documentation

**Key Files:**
- messages/en.json (and all 7 other locale files)
- app/[locale]/about/page.tsx
- public/sitemap.xml
- public/robots.txt

### QA Agent
**Responsibilities:**
- Test all routes across all 8 locales
- Verify search/filter functionality with edge cases (empty results, special characters)
- Test pagination boundaries
- Verify ad units render without layout shift
- Run Lighthouse audits and report scores
- Test mobile layouts on 3 viewport sizes (375px, 768px, 1280px)
- Verify all external source links open correctly

---

## SEO Strategy

### Primary Keywords (High Intent)
- "sanctions tracker 2026" — homepage H1 and title tag
- "russia sanctions list" — Russia country page
- "war sanctions database" — homepage meta description
- "OFAC sanctions list 2026" — OFAC regime page
- "EU sanctions list Russia" — EU regime page targeting Russia
- "UN sanctions list" — UN regime page

### Secondary Keywords
- "sanctioned entities search"
- "OFAC SDN list search"
- "Iran sanctions 2026"
- "North Korea sanctions"
- "Belarus sanctions"
- "Myanmar sanctions list"
- "oligarch sanctions list"

### Long-tail Keywords
- "who is sanctioned by the US in 2026"
- "how to check if a company is sanctioned"
- "latest OFAC designations 2026"
- "EU sanctions on Russian banks"

### Technical SEO
- Static generation for all pages ensures fast TTFB
- hreflang tags on all pages pointing to all 8 locale variants
- Canonical URLs set to /en/ as default locale
- OG images generated per page (conflict-specific imagery)
- JSON-LD: Dataset schema on homepage, BreadcrumbList on all nested pages
- Sitemap covers all entity pages, country pages, regime pages × 8 locales
- Internal linking: entity pages link to country pages, regime pages; country pages link to related sites (strike-signal)

### Content Strategy
- Update frequency: weekly data refresh triggers redeploy
- "Recent Additions" section creates fresh content signal
- Country pages serve as informational landing pages for conflict-specific queries
- About page explains methodology, which builds E-E-A-T signals

---

## Launch Checklist

- [ ] sanctions.json contains ≥ 500 real entities from at least 2 regimes
- [ ] All 8 locale routes return 200 (en, ko, ja, zh, es, fr, de, pt)
- [ ] Homepage stats reflect accurate counts from JSON meta
- [ ] Search returns correct filtered results
- [ ] Pagination works at first, middle, and last pages
- [ ] Entity detail pages load for at least 10 sample entities
- [ ] Regime pages load for OFAC, EU, UN
- [ ] Country pages load for RU, IR, KP, BY, MM (minimum)
- [ ] Language switcher changes locale without 404
- [ ] AdSense ca-pub-7098271335538021 script present in page source
- [ ] Adsterra ad units rendering in designated slots
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt, not blocking /
- [ ] Lighthouse Performance ≥ 90 on homepage
- [ ] Lighthouse SEO ≥ 95 on homepage
- [ ] Lighthouse Accessibility ≥ 90
- [ ] No console errors on any page
- [ ] OG tags verified via og:debugger
- [ ] Google Search Console property verified
- [ ] Sitemap submitted to Google Search Console
- [ ] Vercel deployment URL confirmed: https://sanctions-watch.vercel.app
- [ ] Custom domain configured (if applicable)
- [ ] 404 page displays correctly for invalid entity/country slugs

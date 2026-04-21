import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from 'next/script'
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Sanctions Watch | Real-Time Intelligence',
    template: '%s | Sanctions Watch'
  },
  description: 'Comprehensive database of international sanctions, arms embargoes, and economic restrictions related to armed conflicts',
  keywords: 'sanctions tracker, economic sanctions, arms embargo, financial sanctions, sanctions database, OFAC',
  openGraph: {
    type: 'website',
    siteName: 'Sanctions Watch',
    title: 'Sanctions Watch | Real-Time Intelligence',
    description: 'Comprehensive database of international sanctions, arms embargoes, and economic restrictions related to armed conflicts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanctions Watch',
    description: 'Comprehensive database of international sanctions, arms embargoes, and economic restrictions related to armed conflicts',
  },
  verification: {
    google: 'WddgcbVJsL2BGHNAje5m6DK56IcR0Mw5UOqozI2Xtrc',
  },
  other: {
    'google-adsense-account': 'ca-pub-7098271335538021',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Sanctions Watch",
              "url": "https://sanctions-watch.vercel.app",
              "description": "Comprehensive database of international sanctions, arms embargoes, and economic restrictions",
              "publisher": { "@type": "Organization", "name": "Sanctions Watch", "url": "https://sanctions-watch.vercel.app" }
            })
          }}
        />
      </head>
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { FeedbackButton } from '@/components/FeedbackButton'
import AdHeader from '@/components/ads/AdHeader'
import AdMobileSticky from '@/components/ads/AdMobileSticky'
import VisitorCounter from '@/components/VisitorCounter'
import Link from 'next/link'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AdHeader />
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-violet-500 opacity-75"></span>
              <span className="relative rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            <Link href={`/${locale}`} className="text-lg font-bold">Sanctions Watch</Link>
            <span className="text-xs text-slate-400 border border-slate-700 rounded-full px-2 py-0.5 hidden sm:block">LIVE</span>
          </div>
          <nav className="flex gap-1">
            <Link href={`/${locale}`} className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">Home</Link>
            <Link href={`/${locale}/timeline`} className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">Timeline</Link>
            <Link href={`/${locale}/about`} className="text-slate-300 hover:text-white hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm">About</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 min-h-screen bg-slate-50 text-slate-900">{children}</main>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-slate-700 pt-6 mb-4 mt-4">
            <a href={`/${locale}/about`} className="hover:text-white transition-colors">About Us</a>
            <a href={`/${locale}/faq`} className="hover:text-white transition-colors">How to Use &amp; FAQ</a>
            <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href={`/${locale}/terms`} className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Sanctions Watch</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs">Data from OFAC, European Council, UK FCDO, and UN Security Council</span>
            </div>
            <VisitorCounter />
          </div>
        </div>
      </footer>
      <AdMobileSticky />
      <FeedbackButton siteName="Sanctions Watch" siteUrl="https://sanctions-watch.vercel.app" />
    </NextIntlClientProvider>
  )
}

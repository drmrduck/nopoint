import Link from 'next/link'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { DECKS } from '@/components/decks'
import { HomepageDeckEmbed } from '@/components/homepage-deck-embed'
import { KarpathySocialProof } from '@/components/karpathy-social-proof'
import { SITE_URL } from '@/lib/site'

const HOMEPAGE_DECK_IDS = ['seed-2026', 'buffer', 'airbnb'] as const

function withUtm(url: string, content: string) {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'nopoint')
    u.searchParams.set('utm_medium', 'homepage')
    u.searchParams.set('utm_campaign', 'referral')
    u.searchParams.set('utm_content', content)
    return u.toString()
}

const JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#org`,
            name: 'NoPoint',
            url: SITE_URL,
            logo: `${SITE_URL}/apple-touch-icon.png`,
            sameAs: ['https://github.com/drmrduck/nopoint'],
        },
        {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#site`,
            url: SITE_URL,
            name: 'NoPoint',
            publisher: { '@id': `${SITE_URL}/#org` },
        },
        {
            '@type': 'SoftwareApplication',
            name: 'NoPoint',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: SITE_URL,
            description:
                'Pitch decks as code: programmable React slides, an investor portal, and exportable presentation runtimes.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
    ],
}

export default function MarketingHome() {
    const publicDecks = HOMEPAGE_DECK_IDS.map((id) => DECKS.find((d) => d.id === id))
        .filter((d): d is (typeof DECKS)[number] => Boolean(d?.public))
        .map((d) => ({
            id: d.id,
            title: d.title,
            slideCount: d.slides.length,
        }))

    return (
        <div
            className="dark min-h-screen bg-zinc-950 text-white"
            style={{ colorScheme: 'dark' }}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
            />
            <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-5 sm:px-8 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
                <div className="flex items-center gap-3 min-w-0">
                    <Link href="/" className="flex items-baseline gap-2 shrink-0">
                        <span className="text-2xl leading-none" aria-hidden>🛝</span>
                        <span className="font-headline text-xl font-bold tracking-tight">NoPoint</span>
                        <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300/80 ml-1">
                            All POWER
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href="https://github.com/drmrduck/nopoint"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View nopoint on GitHub"
                        title="View on GitHub"
                        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/70 hover:text-white transition-colors cursor-pointer select-none"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-4 h-4">
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.06 11.06 0 0 1 5.79 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
                        </svg>
                    </Link>
                    <Link
                        href="/investors"
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-semibold transition-colors cursor-pointer select-none"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        Browse decks
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </header>

            <main>
                <section className="relative flex items-center justify-center px-6 py-20 sm:py-24 min-h-[50vh] overflow-hidden">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_60%)]"
                    />
                    <div className="relative z-10 max-w-3xl text-center flex flex-col items-center gap-6">
                        <span
                            className="text-7xl sm:text-8xl leading-none drop-shadow-[0_8px_24px_rgba(59,130,246,0.45)]"
                            aria-hidden
                        >
                            🛝
                        </span>
                        <h1 className="font-headline text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
                            Pitch decks vibe coded
                        </h1>
                        <p className="text-lg sm:text-xl text-white/65 max-w-2xl leading-relaxed">
                            Run everything from your repo — now including
                            pitch decks, built with full repo context. Full
                            npm under the hood, programmatic deck versions
                            per investor, AI personalisation, and live data
                            straight from your own systems. No copy-paste, no
                            drift.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                            <Link
                                href="/getting-started"
                                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white text-sm font-bold transition-colors shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] cursor-pointer select-none"
                            >
                                <Sparkles className="w-4 h-4" />
                                Get started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="px-4 sm:px-6 pb-10 sm:pb-14">
                    <div className="mx-auto w-[80vw] min-w-[320px] max-w-[1600px] aspect-[16/11]">
                        <HomepageDeckEmbed decks={publicDecks} />
                    </div>
                </section>

                <section className="px-4 sm:px-6 pb-16 sm:pb-24">
                    <div className="mx-auto w-full max-w-2xl">
                        <KarpathySocialProof caption="vibe code slides as output here" />
                    </div>
                </section>

                <footer className="px-5 sm:px-8 py-6 text-left">
                    <a
                        href={withUtm('https://drummerduck.com', 'footer-drummerduck')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                        built by drummerduck
                    </a>
                </footer>

                <section
                    aria-hidden
                    className="pt-40 sm:pt-64 pb-8 sm:pb-12 px-4 overflow-hidden select-none"
                >
                    <div className="font-headline font-bold tracking-tight leading-none text-white text-center whitespace-nowrap text-[19vw]">
                        NoPoint
                    </div>
                </section>
            </main>
        </div>
    )
}

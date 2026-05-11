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
            sameAs: ['https://github.com/mewc/nopoint'],
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
                            A private investor portal you actually own. Full
                            npm under the hood, programmatic deck versions per
                            investor, AI personalisation, and live data
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
            </main>
        </div>
    )
}

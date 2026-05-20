import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, BookOpen, ExternalLink, Globe, Lock, LockKeyhole } from 'lucide-react'
import { DECKS } from '@/components/decks'
import { requireInvestor } from '@/lib/investors/guard.server'
import { canAccess } from '@/lib/investors/auth.server'
import { CopyLinkButton } from '@/components/share/copy-link-button'
import { OgPreviewOverlay, OgPreviewToggle } from '@/components/og-preview/og-preview'
import { KarpathySocialProofProdOnly } from '@/components/karpathy-social-proof'

export const metadata: Metadata = {
    title: '🛝 NoPoint Investors — Public decks',
    description:
        'Public investor decks for 🛝 NoPoint. Browse the open templates, or sign in for private partner-only material.',
    alternates: { canonical: '/investors' },
    openGraph: {
        title: '🛝 NoPoint Investors',
        description: 'Public investor decks. Sign in for private partner-only material.',
        url: '/investors',
        type: 'website',
        // The root `app/opengraph-image.tsx` file convention provides the
        // image, but a page-level `openGraph` override replaces the layout's
        // block entirely — so without an explicit `images` here we'd lose the
        // social preview. Pointing at the root route serves the same blue
        // "Pitch decks vibe coded" preview as the homepage.
        images: ['/opengraph-image'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '🛝 NoPoint Investors',
        description: 'Public investor decks. Sign in for private partner-only material.',
        images: ['/opengraph-image'],
    },
}

export default async function InvestorsLandingPage() {
    const cred = await requireInvestor()

    const publicDecks = DECKS.filter((d) => d.public)
    const accessibleGated = cred ? DECKS.filter((d) => !d.public && canAccess(cred, d.id)) : []

    return (
        <div className="min-h-screen bg-zinc-950 text-white" style={{ colorScheme: 'dark' }}>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-baseline gap-2 text-white/70 hover:text-white transition-colors"
                        aria-label="🛝 NoPoint home"
                    >
                        <span className="text-2xl leading-none" aria-hidden>🛝</span>
                        <span className="font-headline text-lg font-bold tracking-tight">NoPoint</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/80 mb-2">
                            Investors
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                            Public decks
                        </h1>
                        <p className="text-white/55 mt-3">
                            Anyone with the URL can view these. Private decks live behind investor
                            credentials. Sign in to access them.
                        </p>
                    </div>
                    <aside className="rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/8 via-blue-500/3 to-transparent p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="size-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                                <LockKeyhole className="size-4 text-blue-300" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-semibold leading-tight">
                                    {cred ? 'Signed in' : 'Have an investor login?'}
                                </h2>
                                <p className="text-white/55 text-sm mt-1 leading-snug">
                                    {cred
                                        ? 'Open the portal to see private partner-only decks.'
                                        : 'Private decks (IMs, partner-only follow-ups, sensitive numbers) sit behind credentials.'}
                                </p>
                            </div>
                        </div>
                        {cred ? (
                            <Link
                                href="/investors/portal"
                                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 font-bold text-white transition-colors"
                            >
                                Open portal
                                <ArrowRight className="size-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/investors/login"
                                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
                            >
                                Investor sign-in
                                <ArrowRight className="size-4" />
                            </Link>
                        )}
                        <div className="mt-5 pt-5 border-t border-white/8">
                            <KarpathySocialProofProdOnly
                                compact
                                caption="vibe code slides as output here"
                                className="w-full"
                            />
                        </div>
                    </aside>
                </div>

                <section>
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <Globe className="size-4 text-emerald-400" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                                Public · {publicDecks.length}
                            </h2>
                        </div>
                        <OgPreviewToggle />
                    </div>

                    {publicDecks.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                            <p className="text-white/40">No public decks yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {publicDecks.map((deck) => {
                                const href = `/investors/decks/${deck.id}`
                                return (
                                    <div
                                        key={deck.id}
                                        className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-emerald-500/30 transition-all overflow-hidden"
                                    >
                                        <Link href={href} className="block">
                                            <OgPreviewOverlay deckId={deck.id} title={deck.title}>
                                                <div className="p-6 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/90">
                                                                <Globe className="size-3" />
                                                                Public
                                                            </span>
                                                        </div>
                                                        <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                                                            {deck.title}
                                                        </h3>
                                                        <p className="text-sm text-white/45 mt-1">
                                                            {deck.description}
                                                        </p>
                                                        <p className="text-xs text-white/25 mt-3">
                                                            {deck.slides.length} slides
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="size-4 text-white/20 group-hover:text-emerald-300 transition-colors mt-0.5 shrink-0" />
                                                </div>
                                            </OgPreviewOverlay>
                                        </Link>
                                        <div className="border-t border-white/8 px-6 py-3 flex items-center justify-between bg-black/20">
                                            <p className="text-[10px] text-white/30 font-mono truncate">
                                                {href}
                                            </p>
                                            <CopyLinkButton href={href} variant="pill" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {cred && accessibleGated.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="size-4 text-blue-400" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                                Your private decks · {accessibleGated.length}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {accessibleGated.map((deck) => (
                                <Link
                                    key={deck.id}
                                    href={`/investors/decks/${deck.id}`}
                                    className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 p-6 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/80 mb-2">
                                                <Lock className="size-3" />
                                                Private
                                            </span>
                                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {deck.title}
                                            </h3>
                                            <p className="text-sm text-white/45 mt-1">
                                                {deck.description}
                                            </p>
                                            <p className="text-xs text-white/25 mt-3">
                                                {deck.slides.length} slides
                                            </p>
                                        </div>
                                        <ExternalLink className="size-4 text-white/20 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mt-16 flex items-center gap-2 text-xs text-white/30">
                    <BookOpen className="size-3.5" />
                    <span>
                        🛝 NoPoint is open source.{' '}
                        <a
                            href="https://github.com/drmrduck/nopoint"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white/60"
                        >
                            View on GitHub
                        </a>
                        .
                    </span>
                </div>
            </div>
        </div>
    )
}

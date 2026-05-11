import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireInvestor } from '@/lib/investors/guard.server'
import { canAccess } from '@/lib/investors/auth.server'
import { DECKS } from '@/components/decks'
import { BookOpen, ExternalLink, FileText, Globe, Lock } from 'lucide-react'
import { LogoutButton } from '@/components/investors/logout-button'
import { PreferencesPanel } from '@/components/investors/preferences-panel'
import { AccessMatrix } from '@/components/investors/access-matrix'
import { CopyLinkButton } from '@/components/share/copy-link-button'
import { OgPreviewOverlay, OgPreviewToggle } from '@/components/og-preview/og-preview'

export default async function PortalPage() {
    const cred = await requireInvestor()
    if (!cred) redirect('/investors/login')

    const accessibleDecks = DECKS.filter((d) => canAccess(cred, d.id))

    return (
        <div
            className="min-h-screen bg-zinc-950 text-white"
            style={{ colorScheme: 'dark' }}
        >
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <Link
                            href="/"
                            aria-label="NoPoint home"
                            className="group inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                        >
                            <h1 className="font-headline text-2xl font-bold transition-colors group-hover:text-blue-200">
                                <span aria-hidden className="mr-2">🛝</span>
                                NoPoint Investor Portal
                            </h1>
                            <p className="text-[11px] text-blue-300/70 font-semibold tracking-wider uppercase mt-1 transition-colors group-hover:text-blue-300">
                                All POWER. Pitch decks as code.
                            </p>
                        </Link>
                        <p className="text-white/50 text-sm mt-2">
                            Welcome, {cred.displayName}
                        </p>
                    </div>
                    <LogoutButton />
                </div>

                <section>
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                                Pitch Decks
                            </h2>
                        </div>
                        <OgPreviewToggle />
                    </div>

                    {accessibleDecks.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                            <p className="text-white/40">No decks available for your account yet.</p>
                            <p className="text-white/25 text-sm mt-1">
                                Contact us if you think this is an error.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {accessibleDecks.map((deck) => {
                                const href = `/investors/decks/${deck.id}`
                                return (
                                    <div
                                        key={deck.id}
                                        className={`group rounded-xl border bg-white/5 hover:bg-white/8 transition-all overflow-hidden ${
                                            deck.public
                                                ? 'border-white/10 hover:border-emerald-500/30'
                                                : 'border-white/10 hover:border-blue-500/30'
                                        }`}
                                    >
                                        <Link href={href} className="block">
                                            <OgPreviewOverlay deckId={deck.id} title={deck.title}>
                                                <div className="p-6 flex items-start justify-between">
                                                    <div>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] mb-2 ${
                                                                deck.public
                                                                    ? 'text-emerald-400/90'
                                                                    : 'text-blue-300/80'
                                                            }`}
                                                        >
                                                            {deck.public ? (
                                                                <>
                                                                    <Globe className="w-3 h-3" />
                                                                    Public
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="w-3 h-3" />
                                                                    Private
                                                                </>
                                                            )}
                                                        </span>
                                                        <h3
                                                            className={`font-semibold text-white transition-colors ${
                                                                deck.public
                                                                    ? 'group-hover:text-emerald-300'
                                                                    : 'group-hover:text-blue-400'
                                                            }`}
                                                        >
                                                            {deck.title}
                                                        </h3>
                                                        <p className="text-sm text-white/40 mt-1">
                                                            {deck.description}
                                                        </p>
                                                        <p className="text-xs text-white/25 mt-3">
                                                            {deck.slides.length} slides
                                                        </p>
                                                    </div>
                                                    <ExternalLink
                                                        className={`w-4 h-4 text-white/20 transition-colors mt-0.5 shrink-0 ${
                                                            deck.public
                                                                ? 'group-hover:text-emerald-300'
                                                                : 'group-hover:text-blue-400'
                                                        }`}
                                                    />
                                                </div>
                                            </OgPreviewOverlay>
                                        </Link>
                                        <div className="border-t border-white/8 px-6 py-3 flex items-center justify-between bg-black/20">
                                            <p className="text-[10px] text-white/30 font-mono truncate">
                                                {href}
                                            </p>
                                            <CopyLinkButton
                                                href={href}
                                                isPublic={!!deck.public}
                                                variant="pill"
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {cred.accessTo === '*' && (
                    <div className="mt-12">
                        <AccessMatrix />
                    </div>
                )}

                <section className="mt-12">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                            Long-form
                        </h2>
                    </div>
                    <Link
                        href="/investors/storytelling"
                        className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 p-6 transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-white">Storytelling</h3>
                                <p className="text-sm text-white/40 mt-1">
                                    Tabbed long-form narrative for material that doesn&apos;t fit a slide.
                                </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                        </div>
                    </Link>
                </section>

                <div className="mt-12">
                    <PreferencesPanel />
                </div>
            </div>
        </div>
    )
}

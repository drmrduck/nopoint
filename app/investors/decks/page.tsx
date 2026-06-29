import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireInvestor } from '@/lib/investors/guard.server'
import { canAccess } from '@/lib/investors/auth.server'
import { DECKS } from '@/components/decks'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export default async function DecksIndexPage() {
    const cred = await requireInvestor()
    if (!cred) redirect('/investors/login')

    const accessibleDecks = DECKS.filter((d) => canAccess(cred, d.id))
    const liveDeck = accessibleDecks.find((d) => d.kind === 'live')
    const exampleDecks = accessibleDecks.filter((d) => d.id !== liveDeck?.id)

    return (
        <div
            className="min-h-screen bg-zinc-950 text-white"
            style={{ colorScheme: 'dark' }}
        >
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href="/investors/portal"
                        className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Portal
                    </Link>
                    <span className="text-white/20">/</span>
                    <h1 className="text-sm font-semibold text-white/60">Deck Library</h1>
                </div>

                {accessibleDecks.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                        <p className="text-white/40">No decks available for your account yet.</p>
                    </div>
                ) : (
                    <>
                        {liveDeck && (
                            <div className="mb-12">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                    </span>
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                                        Live example
                                    </h2>
                                </div>
                                <Link
                                    href={`/investors/decks/${liveDeck.id}`}
                                    className="group block rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.07] to-white/[0.02] hover:border-emerald-400/40 p-7 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                                                {liveDeck.title}
                                            </h3>
                                            <p className="text-sm text-white/50 mt-1.5 max-w-xl">
                                                {liveDeck.description}
                                            </p>
                                            <p className="text-xs text-white/30 mt-4">
                                                {liveDeck.slides.length} slides · pulls real data and updates itself
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-emerald-400/50 group-hover:text-emerald-300 transition-colors mt-1 shrink-0" />
                                    </div>
                                </Link>
                            </div>
                        )}

                        {exampleDecks.length > 0 && (
                            <>
                                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/40 mb-3">
                                    Examples
                                </h2>
                                <p className="text-sm text-white/35 mb-5 max-w-xl">
                                    Reference decks — templates, famous-deck recreations, and demos.
                                    Fork any of them as a starting point.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {exampleDecks.map((deck) => (
                                        <Link
                                            key={deck.id}
                                            href={`/investors/decks/${deck.id}`}
                                            className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 p-6 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                            {deck.title}
                                                        </h3>
                                                        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                                                            Example
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-white/40 mt-1">
                                                        {deck.description}
                                                    </p>
                                                    <p className="text-xs text-white/25 mt-3">
                                                        {deck.slides.length} slides
                                                    </p>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

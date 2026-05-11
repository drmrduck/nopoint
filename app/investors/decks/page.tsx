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

                <h2 className="text-2xl font-bold mb-6">All Decks</h2>

                {accessibleDecks.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                        <p className="text-white/40">No decks available for your account yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {accessibleDecks.map((deck) => (
                            <Link
                                key={deck.id}
                                href={`/investors/decks/${deck.id}`}
                                className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-blue-500/30 p-6 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                            {deck.title}
                                        </h3>
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
                )}
            </div>
        </div>
    )
}

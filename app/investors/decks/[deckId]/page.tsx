import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { requireInvestor } from '@/lib/investors/guard.server'
import { canAccess } from '@/lib/investors/auth.server'
import { isPublicDeck } from '@/lib/decks/visibility'
import { DECKS } from '@/components/decks'
import { DeckViewer } from '@/components/decks/deck-viewer'

interface DeckPageProps {
    params: Promise<{ deckId: string }>
}

export async function generateMetadata({ params }: DeckPageProps): Promise<Metadata> {
    const { deckId } = await params
    const deck = DECKS.find((d) => d.id === deckId)
    if (!deck) return {}

    const url = `/investors/decks/${deck.id}`
    const title = `${deck.title} — 🛝 NoPoint`
    const description = deck.description

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: deck.public
            ? { index: true, follow: true }
            : { index: false, follow: false, nocache: true },
    }
}

export default async function DeckPage({ params }: DeckPageProps) {
    const { deckId } = await params
    const deck = DECKS.find((d) => d.id === deckId)
    if (!deck) notFound()

    if (!isPublicDeck(deckId)) {
        const cred = await requireInvestor()
        if (!cred) redirect('/investors/login')
        if (!canAccess(cred, deck.id)) redirect('/investors/portal')
    }

    return <DeckViewer deckId={deck.id} />
}

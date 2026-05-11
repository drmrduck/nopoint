import { redirect } from 'next/navigation'
import { requireInvestor } from '@/lib/investors/guard.server'
import { isPublicDeck } from '@/lib/decks/visibility'
import type { ReactNode } from 'react'

export default async function DeckLayout({
    children,
    params,
}: {
    children: ReactNode
    params: Promise<{ deckId: string }>
}) {
    const { deckId } = await params
    if (!isPublicDeck(deckId)) {
        const cred = await requireInvestor()
        if (!cred) redirect('/investors/login')
    }
    return (
        <div
            className="h-screen w-screen overflow-hidden bg-zinc-950"
            style={{ colorScheme: 'dark' }}
        >
            {children}
        </div>
    )
}

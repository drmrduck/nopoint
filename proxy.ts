import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/investors/session.server'
import { isPublicDeck } from '@/lib/decks/visibility'

export const config = {
    matcher: [
        '/investors/portal/:path*',
        '/investors/decks/:path*',
        '/investors/storytelling/:path*',
    ],
}

export function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname

    // OG / twitter image route handlers always bypass auth so social cards
    // render even for shared private-deck links. The image renderer renders a
    // generic locked card for non-public decks, never sensitive content.
    if (
        path.endsWith('/opengraph-image') ||
        path.endsWith('/twitter-image') ||
        /\/(opengraph|twitter)-image\/[^/]+$/.test(path)
    ) {
        return NextResponse.next()
    }

    // Public-deck escape hatch: /investors/decks/<deckId> bypasses the gate
    // entirely when the deck is on the public list. The deck library index
    // `/investors/decks` and any unknown deck id stay gated.
    const deckMatch = path.match(/^\/investors\/decks\/([^/]+)/)
    if (deckMatch && isPublicDeck(deckMatch[1])) {
        return NextResponse.next()
    }

    const token = req.cookies.get('investor_session')?.value
    const result = verifySession(token)
    if (!result.valid) {
        const url = req.nextUrl.clone()
        url.pathname = '/investors/login'
        url.searchParams.set('next', req.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}

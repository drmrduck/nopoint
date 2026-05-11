import { NextResponse } from 'next/server'
import { fetchSourcesServer } from '@/lib/chartcastr/client'

/**
 * Proxy GET /v1/sources. Doubles as a key-validity check — a 200 here means
 * CHARTCASTR_API_KEY is good and bound to the returned account.
 *
 * Dev-only: the in-app caller (chartcastr-dialog.tsx) is dev-only, and this
 * route lists every source on the account. Returning 404 in production keeps
 * a deployed CHARTCASTR_API_KEY from leaking the account's source inventory
 * to anyone who hits the URL.
 */
export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return new NextResponse(null, { status: 404 })
    }

    try {
        const data = await fetchSourcesServer()
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'private, no-store' },
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'fetch failed'
        const status = /\b401\b/.test(message) ? 401 : 502
        console.error('[api/chartcastr/sources]', message)
        // Don't echo upstream response bodies back to the client — strip to
        // the leading status code if present.
        const safeMessage = /^chartcastr \d{3}/.test(message)
            ? message.slice(0, 'chartcastr 000'.length)
            : 'chartcastr request failed'
        return NextResponse.json({ error: safeMessage }, { status })
    }
}

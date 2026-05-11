/**
 * GET /api/stripe-mrr → { mrrCents: number | null, source: 'stripe' | 'fallback' }
 *
 * Thin JSON wrapper around `fetchStripeMrr()` for any client that wants to poll
 * MRR without server-component-rendering the traction slide. The Hummingbird
 * traction slide itself is a Server Component and calls `fetchStripeMrr()`
 * directly — this route exists for embeds, exports, or future client polls.
 */

import { fetchStripeMrr } from '@/lib/hummingbird/stripe-mrr'

export async function GET() {
    const mrrCents = await fetchStripeMrr()
    return Response.json({
        mrrCents,
        source: mrrCents === null ? 'fallback' : 'stripe',
    })
}

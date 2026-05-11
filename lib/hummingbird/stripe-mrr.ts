/**
 * Live MRR fetch for Hummingbird's Traction slide.
 *
 * Approach: list active subscriptions from Stripe, sum the recurring amount of
 * every subscription item normalised to a monthly cadence. This is the same
 * "sum-of-active-subscription-items" definition Stripe's own dashboard uses for
 * MRR (excluding one-off invoices, refunds, and unpaid trials).
 *
 * The function returns cents to keep it untyped-into-floats. Returns `null`
 * when STRIPE_KEY is unset or the Stripe API call fails — the slide treats
 * `null` as "fall back to the static $48K headline" so the deck never breaks.
 *
 * Caching: Next.js `fetch` cache via `next: { revalidate: 300 }` means the
 * Stripe API is hit at most once every 5 minutes per deployment, even if the
 * traction slide is rendered on every navigation.
 */

interface StripeSubscriptionItem {
    plan: {
        amount: number | null
        interval: 'day' | 'week' | 'month' | 'year'
        interval_count: number
    }
    quantity: number
}

interface StripeSubscription {
    status: string
    items: { data: StripeSubscriptionItem[] }
}

interface StripeListResponse {
    data: StripeSubscription[]
    has_more: boolean
}

const STRIPE_BASE = 'https://api.stripe.com/v1'

function monthlyCents(item: StripeSubscriptionItem): number {
    const { plan, quantity } = item
    if (!plan?.amount) return 0
    const perPeriod = plan.amount * (quantity ?? 1)
    const count = plan.interval_count || 1
    switch (plan.interval) {
        case 'month':
            return perPeriod / count
        case 'year':
            return perPeriod / (12 * count)
        case 'week':
            return (perPeriod * 52) / 12 / count
        case 'day':
            return (perPeriod * 365) / 12 / count
        default:
            return 0
    }
}

export async function fetchStripeMrr(): Promise<number | null> {
    const key = process.env.STRIPE_KEY
    if (!key) return null

    try {
        let total = 0
        let starting_after: string | undefined
        // Cap at 5 pages to avoid runaway loops. 100 × 5 = 500 active
        // subscriptions covered before falling back to whatever we have.
        for (let page = 0; page < 5; page++) {
            const params = new URLSearchParams({
                status: 'active',
                limit: '100',
                'expand[]': 'data.items',
            })
            if (starting_after) params.set('starting_after', starting_after)

            const res = await fetch(`${STRIPE_BASE}/subscriptions?${params}`, {
                headers: { Authorization: `Bearer ${key}` },
                next: { revalidate: 300 },
            })
            if (!res.ok) {
                console.warn('[hummingbird] stripe MRR fetch failed', res.status)
                return null
            }
            const body = (await res.json()) as StripeListResponse & { data: Array<StripeSubscription & { id: string }> }
            for (const sub of body.data) {
                if (sub.status !== 'active') continue
                for (const item of sub.items.data) {
                    total += monthlyCents(item)
                }
            }
            if (!body.has_more || body.data.length === 0) break
            starting_after = body.data[body.data.length - 1].id
        }
        return Math.round(total)
    } catch (err) {
        console.warn('[hummingbird] stripe MRR fetch threw', err)
        return null
    }
}

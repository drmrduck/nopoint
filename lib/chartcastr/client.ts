/**
 * Chartcastr public API — server-side client.
 *
 * The base URL defaults to the public API and can be overridden with
 * CHARTCASTR_API_URL (intended for local Chartcastr development against
 * http://localhost:8109 — almost no one else will need to set it).
 * The API key is server-only (never NEXT_PUBLIC_) and read at request time so
 * a missing key fails loudly with a 502 from the proxy route, not at module
 * load.
 */

export const CHARTCASTR_API_URL_DEFAULT = 'https://public.api.chartcastr.com/v1'

export function getChartcastrApiUrl(): string {
    return process.env.CHARTCASTR_API_URL?.replace(/\/$/, '') || CHARTCASTR_API_URL_DEFAULT
}

export interface ChartcastrAccount {
    id: string
    email: string
}

export interface ChartcastrSourceListEntry {
    id: string
    name: string | null
    provider: string
    status: 'PENDING' | 'DRAFT' | 'ACTIVE' | 'DEGRADED' | 'BROKEN' | string
    link: string
    connectionCount: number
    organizationId: string
    organizationName: string | null
    organizationSlug: string | null
}

export interface ChartcastrSourcesResponse {
    account: ChartcastrAccount
    sources: ChartcastrSourceListEntry[]
    requestedAt: string
}

export interface ChartcastrPulse {
    sourceId: string
    sourceName: string
    imageUrl: string
    aiSummaryShort?: string
    aiSummaryLong?: string
    completedAt: string
    deliveryLink?: string
}

function authHeaders(): Record<string, string> {
    const apiKey = process.env.CHARTCASTR_API_KEY
    if (!apiKey) throw new Error('CHARTCASTR_API_KEY not set')
    return { 'X-API-Key': apiKey, 'Content-Type': 'application/json' }
}

/**
 * GET /v1/sources — verify key and resolve account. Doubles as a list of
 * sources for the authenticated account (capped at 10, ordered by updatedAt).
 */
export async function fetchSourcesServer(): Promise<ChartcastrSourcesResponse> {
    const res = await fetch(`${getChartcastrApiUrl()}/sources`, {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store',
    })

    if (!res.ok) {
        // Read and discard the body so the connection can be reused; do NOT
        // include it in the thrown error — these messages get surfaced to
        // clients via the proxy route.
        await res.text().catch(() => '')
        throw new Error(`chartcastr ${res.status} ${res.statusText}`)
    }

    const json = (await res.json()) as {
        meta?: { account?: ChartcastrAccount; requestedAt?: string }
        sources?: ChartcastrSourceListEntry[]
    }

    const account = json.meta?.account
    if (!account?.id) throw new Error('chartcastr response missing meta.account.id')

    return {
        account,
        sources: json.sources ?? [],
        requestedAt: json.meta?.requestedAt ?? new Date().toISOString(),
    }
}

/**
 * GET /v1/sources/{sourceId}/pulse — latest pulse for a source.
 */
export async function fetchLatestPulseServer(sourceId: string): Promise<ChartcastrPulse> {
    const res = await fetch(
        `${getChartcastrApiUrl()}/sources/${encodeURIComponent(sourceId)}/pulse`,
        {
            method: 'GET',
            headers: authHeaders(),
            cache: 'no-store',
        },
    )

    if (!res.ok) {
        throw new Error(`chartcastr ${res.status} ${res.statusText}`)
    }

    const json = await res.json()
    // Tolerate both { pulse: {...} } (per docs) and a bare pulse payload.
    const payload = (json?.pulse ?? json?.result ?? json) as Partial<ChartcastrPulse>

    if (!payload?.imageUrl) {
        throw new Error('chartcastr response missing imageUrl')
    }

    return {
        sourceId: payload.sourceId ?? sourceId,
        sourceName: payload.sourceName ?? '',
        imageUrl: payload.imageUrl,
        aiSummaryShort: payload.aiSummaryShort,
        aiSummaryLong: payload.aiSummaryLong,
        completedAt: payload.completedAt ?? new Date().toISOString(),
        deliveryLink: payload.deliveryLink,
    }
}

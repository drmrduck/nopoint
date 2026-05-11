'use client'

import type { ChartcastrPulse } from './client'

const cache = new Map<string, Promise<ChartcastrPulse>>()

export function getChartcastrPulse(
    sourceId: string,
    force = false,
): Promise<ChartcastrPulse> {
    if (!force) {
        const hit = cache.get(sourceId)
        if (hit) return hit
    }

    const p = fetch(`/api/chartcastr/${encodeURIComponent(sourceId)}`).then(async (r) => {
        if (!r.ok) {
            const body = await r.json().catch(() => ({}))
            throw new Error(body?.error ?? `chartcastr proxy ${r.status}`)
        }
        return (await r.json()) as ChartcastrPulse
    })

    cache.set(sourceId, p)
    p.catch(() => cache.delete(sourceId))
    return p
}

export function prefetchChartcastrSources(sourceIds: readonly string[]): void {
    for (const id of sourceIds) {
        if (id) void getChartcastrPulse(id)
    }
}

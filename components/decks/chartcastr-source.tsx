'use client'

/**
 * <ChartcastrSource sourceId="..." /> — embeds a live chart image pulled from
 * chartcastr.com via the /api/chartcastr/[sourceId] proxy. The proxy keeps
 * CHARTCASTR_API_KEY server-side.
 *
 * Prefetch path: declare the sourceId on the slide via
 *   { id: '...', component: ..., chartcastrSourceIds: ['<uuid>'] }
 * and the deck-viewer will fetch it on deck mount, so by the time the viewer
 * navigates to the slide the image is already in the in-memory cache.
 *
 * Example:
 *   <ChartcastrSource
 *       sourceId="abc-123"
 *       className="aspect-video w-[640px]"
 *       showSummary
 *   />
 */

import { useEffect, useState } from 'react'
import { ExternalLink, RefreshCw, Activity } from 'lucide-react'
import { getChartcastrPulse } from '@/lib/chartcastr/browser-cache'
import type { ChartcastrPulse } from '@/lib/chartcastr/client'
import { isDevMode } from '@/lib/utils/env'

interface ChartcastrSourceProps {
    sourceId: string
    className?: string
    showSummary?: boolean
    /** Override the badge label. Default: "Live from chartcastr". */
    badgeLabel?: string
}

export function ChartcastrSource({
    sourceId,
    className,
    showSummary,
    badgeLabel = 'Live from chartcastr',
}: ChartcastrSourceProps) {
    const [pulse, setPulse] = useState<ChartcastrPulse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        let cancelled = false
        getChartcastrPulse(sourceId, reloadKey > 0)
            .then((p) => {
                if (cancelled) return
                setPulse(p)
                setError(null)
                setRefreshing(false)
            })
            .catch((e: unknown) => {
                if (cancelled) return
                setError(e instanceof Error ? e.message : 'fetch failed')
                setRefreshing(false)
            })
        return () => {
            cancelled = true
        }
    }, [sourceId, reloadKey])

    const handleRefresh = () => {
        setRefreshing(true)
        setReloadKey((k) => k + 1)
    }

    return (
        <div className={joinClasses('relative inline-block', className)}>
            {pulse ? (
                <img
                    src={pulse.imageUrl}
                    alt={pulse.sourceName || 'Chart'}
                    className="block h-full w-full rounded-2xl object-contain"
                />
            ) : error ? (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500">
                    Live source unavailable
                </div>
            ) : (
                <div className="h-full w-full animate-pulse rounded-2xl bg-neutral-100" />
            )}

            {pulse && (
                <ChartcastrBadge
                    pulse={pulse}
                    label={badgeLabel}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}

            {showSummary && pulse?.aiSummaryShort && (
                <p className="mt-3 text-sm leading-snug text-neutral-700">
                    {pulse.aiSummaryShort}
                </p>
            )}
        </div>
    )
}

interface BadgeProps {
    pulse: ChartcastrPulse
    label: string
    refreshing: boolean
    onRefresh: () => void
}

function ChartcastrBadge({ pulse, label, refreshing, onRefresh }: BadgeProps) {
    const dev = isDevMode()
    const link = pulse.deliveryLink ?? `https://chartcastr.com/sources/${pulse.sourceId}`
    const relative = formatRelative(pulse.completedAt)

    return (
        <div className="group absolute right-2 top-2 z-10 flex items-center">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                <Activity className="h-3 w-3" />
                <span>{label}</span>
            </div>

            {/* Hover/click popover. Always shows timestamp; LOCAL adds dev tools. */}
            <div className="pointer-events-none absolute right-0 top-full mt-1 w-max max-w-xs rounded-md bg-neutral-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="text-neutral-300">
                    Updated <span className="text-white">{relative}</span>
                </div>
                {dev && (
                    <div className="mt-2 flex items-center gap-3 border-t border-neutral-700 pt-2">
                        <a
                            href={link}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
                        >
                            <ExternalLink className="h-3 w-3" /> Open in chartcastr
                        </a>
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center gap-1 text-neutral-200 hover:text-white disabled:opacity-50"
                        >
                            <RefreshCw
                                className={joinClasses('h-3 w-3', refreshing && 'animate-spin')}
                            />
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

function formatRelative(iso: string): string {
    const then = new Date(iso).getTime()
    if (Number.isNaN(then)) return 'just now'
    const diffSec = Math.round((then - Date.now()) / 1000)
    const abs = Math.abs(diffSec)
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
    if (abs < 60) return rtf.format(Math.round(diffSec), 'second')
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute')
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour')
    return rtf.format(Math.round(diffSec / 86400), 'day')
}

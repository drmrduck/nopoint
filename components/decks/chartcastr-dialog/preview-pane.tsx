import { useCallback, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Check, Copy, ExternalLink, Loader2, Sparkles } from 'lucide-react'
import type { ChartcastrPulse, ChartcastrSourceListEntry } from '@/lib/chartcastr/client'
import { buildInstallPrompt } from './install-prompt'

export function PreviewPane({
    source,
    pulse,
    loading,
    error,
    onRetry,
}: {
    source: ChartcastrSourceListEntry
    pulse: ChartcastrPulse | null
    loading: boolean
    error: string | null
    onRetry: () => void
}) {
    const [withSummary, setWithSummary] = useState(false)
    const [copiedJsx, setCopiedJsx] = useState(false)
    const [copiedPrompt, setCopiedPrompt] = useState(false)

    // Detect the current deck + slide so the AI prompt can name them. We pull
    // deckId from the path (/investors/decks/<deckId>) and slide from the
    // ?slide= query param. Both are best-effort — if either is missing the
    // prompt falls back to a generic "pick a slide" instruction.
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const deckId = useMemo(() => {
        const m = pathname?.match(/\/decks\/([^/]+)/)
        return m?.[1]
    }, [pathname])
    const slideId = searchParams?.get('slide') ?? undefined
    const variantId = searchParams?.get('variant') ?? undefined

    const snippet = withSummary
        ? `<ChartcastrSource sourceId="${source.id}" showSummary />`
        : `<ChartcastrSource sourceId="${source.id}" />`

    const prompt = buildInstallPrompt({
        sourceId: source.id,
        sourceName: source.name || '(unnamed source)',
        snippet,
        deckId,
        slideId,
        variantId,
    })

    const copyJsx = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(snippet)
            setCopiedJsx(true)
            setTimeout(() => setCopiedJsx(false), 1400)
        } catch {
            // Clipboard may be unavailable in some browser contexts; ignore.
        }
    }, [snippet])

    const copyPrompt = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(prompt)
            setCopiedPrompt(true)
            setTimeout(() => setCopiedPrompt(false), 1400)
        } catch {
            // Clipboard may be unavailable in some browser contexts; ignore.
        }
    }, [prompt])

    return (
        <div className="space-y-3">
            <div>
                <p className="text-xs font-semibold text-white/90">
                    {source.name || '(unnamed)'}
                </p>
                <p className="font-mono text-[10px] text-white/40">{source.id}</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/30">
                {loading ? (
                    <div className="flex aspect-video items-center justify-center text-xs text-white/50">
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Loading pulse …
                    </div>
                ) : error ? (
                    <div className="space-y-2 p-3">
                        <p className="text-xs font-semibold text-red-300">Pulse fetch failed</p>
                        <pre className="overflow-x-auto rounded bg-red-500/10 px-2 py-1.5 text-[11px] text-red-200/90">
                            {error}
                        </pre>
                        <button
                            onClick={onRetry}
                            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                        >
                            Retry
                        </button>
                    </div>
                ) : pulse ? (
                    <img
                        src={pulse.imageUrl}
                        alt={pulse.sourceName || source.name || 'Chart'}
                        className="block h-auto w-full"
                    />
                ) : null}
            </div>

            {pulse?.aiSummaryShort && (
                <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                        Short summary
                    </p>
                    <p className="text-xs leading-relaxed text-white/75">
                        {pulse.aiSummaryShort}
                    </p>
                </div>
            )}

            {pulse?.aiSummaryLong && (
                <details className="group">
                    <summary className="cursor-pointer list-none text-[10px] font-semibold uppercase tracking-wider text-white/40 hover:text-white/60">
                        Long analysis
                        <span className="ml-1 text-white/20 group-open:hidden">▸</span>
                        <span className="ml-1 hidden text-white/20 group-open:inline">▾</span>
                    </summary>
                    <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-white/65">
                        {pulse.aiSummaryLong}
                    </p>
                </details>
            )}

            {/* Copy panel — render even while pulse is loading so the user can grab
                the snippet without waiting on the image. */}
            <div className="space-y-2 rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-200/80">
                        Inject into a slide
                    </p>
                    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] text-white/70">
                        <input
                            type="checkbox"
                            checked={withSummary}
                            onChange={(e) => setWithSummary(e.target.checked)}
                            className="h-3 w-3 accent-yellow-400"
                        />
                        + summary
                    </label>
                </div>
                <pre className="overflow-x-auto rounded bg-black/40 px-2 py-1.5 font-mono text-[11px] text-yellow-100/90">
                    {snippet}
                </pre>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={copyJsx}
                        className="flex items-center gap-1.5 rounded-md border border-yellow-500/30 bg-yellow-500/15 px-3 py-1.5 text-xs font-medium text-yellow-100 hover:bg-yellow-500/25"
                    >
                        {copiedJsx ? (
                            <>
                                <Check className="h-3 w-3" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" /> Copy JSX
                            </>
                        )}
                    </button>
                    <button
                        onClick={copyPrompt}
                        title={
                            slideId && deckId
                                ? `Copy an install prompt targeted at the "${slideId}" slide of ${deckId}.`
                                : 'Copy a generic install prompt for any slide.'
                        }
                        className="flex items-center gap-1.5 rounded-md border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-blue-500/25"
                    >
                        {copiedPrompt ? (
                            <>
                                <Check className="h-3 w-3" /> Copied
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-3 w-3" /> Copy Prompt
                            </>
                        )}
                    </button>
                    <a
                        href={source.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="ml-auto flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80"
                    >
                        <ExternalLink className="h-3 w-3" /> Open in admin
                    </a>
                </div>
                <p className="text-[10px] text-white/40">
                    {slideId && deckId ? (
                        <>
                            Prompt is targeted at{' '}
                            <code className="rounded bg-white/5 px-1">
                                {deckId}
                                {' / '}
                                {slideId}
                                {variantId ? ` · ${variantId}` : ''}
                            </code>
                            . Paste into Claude / Cursor and the agent will install
                            the source on that slide.
                        </>
                    ) : (
                        'Open a specific slide URL (?slide=&hellip;) to make the prompt slide-aware.'
                    )}
                </p>
            </div>
        </div>
    )
}

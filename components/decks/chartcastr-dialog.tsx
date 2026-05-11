'use client'

/**
 * <ChartcastrDialog /> — LOCAL-ONLY tester for the Chartcastr public API.
 *
 * Renders a small Activity-icon button in the deck-viewer's top-right rail
 * when `isDevMode()`. Click → opens a chained dialog:
 *
 *   1. Validate CHARTCASTR_API_KEY by hitting GET /api/chartcastr/sources
 *      (which proxies GET /v1/sources). Shows account.id + email on success.
 *   2. List the returned sources. Click one to fetch its latest pulse via
 *      GET /api/chartcastr/<sourceId>.
 *   3. Preview the chart image, short summary, and long analysis. A "Copy
 *      JSX" button copies a <ChartcastrSource ... /> snippet to the clipboard.
 *      Default is image-only; toggle for image + summary.
 *
 * Production builds never render this — the parent gate is `isDevMode()`.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
    Activity,
    Check,
    Copy,
    ExternalLink,
    Loader2,
    RefreshCw,
    Sparkles,
    X,
} from 'lucide-react'
import type {
    ChartcastrAccount,
    ChartcastrPulse,
    ChartcastrSourceListEntry,
    ChartcastrSourcesResponse,
} from '@/lib/chartcastr/client'

interface Props {
    open: boolean
    onToggle: () => void
    onClose: () => void
}

type Step = 'verify' | 'pick' | 'preview'

export function ChartcastrDialog({ open, onToggle, onClose }: Props) {
    return (
        <div className="group/widget relative">
            <button
                onClick={onToggle}
                aria-label="Chartcastr API tester (local only)"
                aria-expanded={open}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    open
                        ? 'border border-yellow-500/40 bg-yellow-500/20 text-yellow-200'
                        : 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-300/80 hover:bg-yellow-500/20 hover:text-yellow-200'
                }`}
            >
                <Activity className="h-3.5 w-3.5" />
            </button>

            <span
                role="tooltip"
                className="pointer-events-none absolute top-9 right-0 z-50 hidden whitespace-nowrap rounded-md border border-yellow-500/30 bg-zinc-950/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-200/90 shadow-lg backdrop-blur-sm group-hover/widget:block"
            >
                Chartcastr API <span className="text-yellow-200/40">· LOCAL</span>
            </span>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-10 right-0 z-40 w-[420px] overflow-hidden rounded-xl border border-yellow-500/30 bg-zinc-950/98 shadow-2xl"
                    >
                        <DialogBody onClose={onClose} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function DialogBody({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<Step>('verify')
    const [account, setAccount] = useState<ChartcastrAccount | null>(null)
    const [sources, setSources] = useState<ChartcastrSourceListEntry[]>([])
    const [verifyError, setVerifyError] = useState<string | null>(null)
    const [verifying, setVerifying] = useState(false)

    const [selectedSource, setSelectedSource] = useState<ChartcastrSourceListEntry | null>(null)
    const [pulse, setPulse] = useState<ChartcastrPulse | null>(null)
    const [pulseError, setPulseError] = useState<string | null>(null)
    const [pulseLoading, setPulseLoading] = useState(false)

    const verify = useCallback(async () => {
        setVerifying(true)
        setVerifyError(null)
        try {
            const res = await fetch('/api/chartcastr/sources', { cache: 'no-store' })
            const body = await res.json()
            if (!res.ok) throw new Error(body?.error ?? `proxy ${res.status}`)
            const data = body as ChartcastrSourcesResponse
            setAccount(data.account)
            setSources(data.sources)
            setStep('pick')
        } catch (err) {
            setVerifyError(err instanceof Error ? err.message : 'verification failed')
        } finally {
            setVerifying(false)
        }
    }, [])

    // Fetch on mount. The lint rule flags setState-in-effect, but this is
    // the canonical "load data on mount" pattern; verify() owns its own
    // loading and error state and the dialog has nothing to render until it
    // resolves.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void verify()
    }, [verify])

    const loadPulse = useCallback(async (source: ChartcastrSourceListEntry) => {
        setSelectedSource(source)
        setStep('preview')
        setPulse(null)
        setPulseError(null)
        setPulseLoading(true)
        try {
            const res = await fetch(`/api/chartcastr/${encodeURIComponent(source.id)}`, {
                cache: 'no-store',
            })
            const body = await res.json()
            if (!res.ok) throw new Error(body?.error ?? `proxy ${res.status}`)
            setPulse(body as ChartcastrPulse)
        } catch (err) {
            setPulseError(err instanceof Error ? err.message : 'pulse fetch failed')
        } finally {
            setPulseLoading(false)
        }
    }, [])

    return (
        <div>
            <Header
                step={step}
                account={account}
                onBack={
                    step === 'preview'
                        ? () => {
                              setStep('pick')
                              setSelectedSource(null)
                              setPulse(null)
                              setPulseError(null)
                          }
                        : undefined
                }
                onRetry={step === 'verify' || verifyError ? verify : undefined}
                verifying={verifying}
                onClose={onClose}
            />

            <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {step === 'verify' && (
                    <VerifyPane verifying={verifying} error={verifyError} onRetry={verify} />
                )}

                {step === 'pick' && (
                    <PickPane sources={sources} onPick={loadPulse} onRetry={verify} />
                )}

                {step === 'preview' && selectedSource && (
                    <PreviewPane
                        source={selectedSource}
                        pulse={pulse}
                        loading={pulseLoading}
                        error={pulseError}
                        onRetry={() => loadPulse(selectedSource)}
                    />
                )}
            </div>
        </div>
    )
}

function Header({
    step,
    account,
    onBack,
    onRetry,
    verifying,
    onClose,
}: {
    step: Step
    account: ChartcastrAccount | null
    onBack?: () => void
    onRetry?: () => void
    verifying: boolean
    onClose: () => void
}) {
    return (
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-yellow-300" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-yellow-200/70">
                    Chartcastr · LOCAL
                </p>
                <StepBadge step={step} />
            </div>
            <div className="flex items-center gap-1.5">
                {account && (
                    <span
                        className="hidden truncate text-[10px] text-white/40 sm:inline"
                        title={`${account.email} · ${account.id}`}
                    >
                        {account.email}
                    </span>
                )}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="rounded px-2 py-1 text-[10px] font-medium text-white/60 hover:bg-white/10 hover:text-white"
                    >
                        ← Back
                    </button>
                )}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        disabled={verifying}
                        title="Re-verify key"
                        className="flex h-6 w-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3 w-3 ${verifying ? 'animate-spin' : ''}`} />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="flex h-6 w-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white"
                >
                    <X className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}

function StepBadge({ step }: { step: Step }) {
    const steps: Step[] = ['verify', 'pick', 'preview']
    const idx = steps.indexOf(step)
    return (
        <span className="text-[10px] text-white/30">
            {idx + 1}/3 · {step}
        </span>
    )
}

function VerifyPane({
    verifying,
    error,
    onRetry,
}: {
    verifying: boolean
    error: string | null
    onRetry: () => void
}) {
    if (verifying) {
        return (
            <div className="flex items-center gap-2 py-6 text-xs text-white/60">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Calling GET /v1/sources …</span>
            </div>
        )
    }
    if (error) {
        return (
            <div className="space-y-3 py-2">
                <p className="text-xs font-semibold text-red-300">Key check failed</p>
                <pre className="overflow-x-auto rounded bg-red-500/10 px-2.5 py-2 text-[11px] text-red-200/90">
                    {error}
                </pre>
                <p className="text-[11px] text-white/50">
                    Check <code className="rounded bg-white/5 px-1">CHARTCASTR_API_KEY</code> in
                    <code className="rounded bg-white/5 px-1">.env.local</code>, then retry.
                </p>
                <button
                    onClick={onRetry}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                    Retry
                </button>
            </div>
        )
    }
    return null
}

function PickPane({
    sources,
    onPick,
    onRetry,
}: {
    sources: ChartcastrSourceListEntry[]
    onPick: (s: ChartcastrSourceListEntry) => void
    onRetry: () => void
}) {
    if (sources.length === 0) {
        return (
            <div className="space-y-3 py-2">
                <p className="text-xs text-white/60">
                    Key works, but the account has no sources. Create one in the
                    Chartcastr admin, then refresh.
                </p>
                <button
                    onClick={onRetry}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                    Refresh
                </button>
            </div>
        )
    }
    return (
        <div className="space-y-1.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Sources ({sources.length})
            </p>
            {sources.map((s) => (
                <button
                    key={s.id}
                    onClick={() => onPick(s)}
                    className="group flex w-full items-center justify-between gap-3 rounded-md border border-white/8 bg-white/2 px-3 py-2 text-left transition hover:border-yellow-500/30 hover:bg-yellow-500/5"
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white/90">
                            {s.name || <span className="text-white/40">(unnamed)</span>}
                        </p>
                        <p className="truncate text-[10px] text-white/40">
                            <span className="font-mono">{s.id}</span> · {s.provider} ·{' '}
                            <StatusDot status={s.status} /> {s.status}
                            {s.connectionCount ? ` · ${s.connectionCount} conn` : ''}
                        </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-yellow-300/0 group-hover:text-yellow-300/90">
                        Load →
                    </span>
                </button>
            ))}
        </div>
    )
}

function StatusDot({ status }: { status: string }) {
    const color =
        status === 'ACTIVE'
            ? 'bg-emerald-400'
            : status === 'DEGRADED'
              ? 'bg-amber-400'
              : status === 'BROKEN'
                ? 'bg-red-400'
                : 'bg-white/30'
    return <span className={`mr-0.5 inline-block h-1.5 w-1.5 rounded-full ${color}`} />
}

function PreviewPane({
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

// Builds an AI-ready install prompt. When deck + slide are known (from the
// URL), the prompt names the exact file paths so an agent can apply the edit
// without guessing. When they're not, it falls back to a generic instruction.
function buildInstallPrompt({
    sourceId,
    sourceName,
    snippet,
    deckId,
    slideId,
    variantId,
}: {
    sourceId: string
    sourceName: string
    snippet: string
    deckId?: string
    slideId?: string
    variantId?: string
}): string {
    const variantNote =
        variantId && variantId !== 'default'
            ? `\n   (Variant in view: ${variantId} — file likely lives under slides/${slideId}-variants/${variantId}.tsx. Pick the right file based on what's currently rendered.)`
            : ''

    if (deckId && slideId) {
        return `Install a live Chartcastr chart into the "${slideId}" slide of the ${deckId} deck.

Source: "${sourceName}"
Source ID: ${sourceId}

Steps:

1. Edit components/decks/${deckId}/slides/${slideId}-slide.tsx${variantNote}
   - Add this import at the top:
     import { ChartcastrSource } from '@/components/decks/chartcastr-source'
   - Embed the component in a sensible spot in the slide JSX:
     ${snippet}
   - Keep the surrounding copy minimal — let the chart carry the message.

2. Edit components/decks/${deckId}/slides/index.ts
   - Find the registry entry with id: '${slideId}'
   - Add this field so the deck-viewer prefetches the chart on mount:
     chartcastrSourceIds: ['${sourceId}']

3. Update the slide's context.nailsThis (in the same registry entry) to mention that the chart is now load-bearing evidence on this slide.

Then run \`npx tsc --noEmit -p tsconfig.json\` to confirm there are no type errors.`
    }

    return `Install a live Chartcastr chart into one of my deck slides.

Source: "${sourceName}"
Source ID: ${sourceId}
Component snippet: ${snippet}

Steps:

1. Pick the most appropriate slide for this source (Traction, Market, and Product are usually the best fits).

2. Edit components/decks/<deckId>/slides/<slideId>-slide.tsx
   - Add this import at the top:
     import { ChartcastrSource } from '@/components/decks/chartcastr-source'
   - Embed the component in a sensible spot in the slide JSX:
     ${snippet}

3. Edit components/decks/<deckId>/slides/index.ts
   - Find the registry entry for that slide
   - Add this field so the deck-viewer prefetches the chart on mount:
     chartcastrSourceIds: ['${sourceId}']

Tip: open the slide directly (e.g. /investors/decks/<deckId>?slide=<slideId>) and re-copy the prompt — it will then be slide-aware and skip step 1.`
}

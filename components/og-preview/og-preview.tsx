'use client'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ImageIcon, RefreshCw, Eye, EyeOff } from 'lucide-react'

const STATE_KEY = 'og_preview_state'
const EVENT = 'og-preview-change'

interface OgState {
    enabled: boolean
    bust: string
}

// OG preview cards are the default everywhere — they show the actual social /
// sharing artifact each deck produces, which is what investors should see when
// browsing the library. The toggle component stays dev-only; production users
// can't switch it off, but the dev workflow still gets the on/off/refresh row.
const DEFAULT_STATE: OgState = { enabled: true, bust: '' }

function readState(): OgState {
    if (typeof window === 'undefined') return DEFAULT_STATE
    try {
        const raw = localStorage.getItem(STATE_KEY)
        if (!raw) return DEFAULT_STATE
        const parsed = JSON.parse(raw) as OgState
        return {
            enabled: !!parsed.enabled,
            bust: typeof parsed.bust === 'string' ? parsed.bust : '',
        }
    } catch {
        return DEFAULT_STATE
    }
}

function writeState(next: OgState) {
    localStorage.setItem(STATE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
    window.addEventListener(EVENT, cb)
    window.addEventListener('storage', cb)
    return () => {
        window.removeEventListener(EVENT, cb)
        window.removeEventListener('storage', cb)
    }
}

// useSyncExternalStore requires referentially stable snapshots. Cache the last
// snapshot and only return a new object when the persisted value actually
// changes — otherwise React loops with a "getSnapshot should be cached" warning.
let cachedSnapshot: OgState = DEFAULT_STATE
let cachedRaw: string | null = null
function getSnapshot(): OgState {
    if (typeof window === 'undefined') return DEFAULT_STATE
    const raw = localStorage.getItem(STATE_KEY)
    if (raw === cachedRaw) return cachedSnapshot
    cachedRaw = raw
    cachedSnapshot = readState()
    return cachedSnapshot
}

function getServerSnapshot(): OgState {
    return DEFAULT_STATE
}

export function useOgPreview(): OgState {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function OgPreviewToggle() {
    const { enabled } = useOgPreview()

    if (process.env.NODE_ENV === 'production') return null

    function setEnabled(next: boolean) {
        writeState({ enabled: next, bust: next ? String(Date.now()) : '' })
    }

    function refresh() {
        writeState({ enabled: true, bust: String(Date.now()) })
    }

    return (
        <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-yellow-300/55">
                <ImageIcon className="w-3 h-3" />
                Local · OG
            </span>
            <div
                role="group"
                aria-label="OG preview"
                className="inline-flex items-center rounded-lg border border-yellow-500/35 bg-yellow-500/[0.04] p-0.5"
            >
                <button
                    onClick={() => setEnabled(false)}
                    aria-pressed={!enabled}
                    title="Hide OG previews"
                    className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        !enabled
                            ? 'bg-yellow-500/30 text-yellow-100'
                            : 'text-yellow-200/55 hover:text-yellow-100 hover:bg-yellow-500/10'
                    }`}
                >
                    <EyeOff className="w-3 h-3" />
                    Off
                </button>
                <button
                    onClick={() => setEnabled(true)}
                    aria-pressed={enabled}
                    title="Show OG previews in cards"
                    className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        enabled
                            ? 'bg-yellow-500/30 text-yellow-100'
                            : 'text-yellow-200/55 hover:text-yellow-100 hover:bg-yellow-500/10'
                    }`}
                >
                    <Eye className="w-3 h-3" />
                    On
                </button>
                <button
                    onClick={refresh}
                    title="Refresh OG images (bust cache)"
                    className="flex items-center justify-center w-7 h-7 ml-0.5 rounded-md text-yellow-200/55 hover:text-yellow-100 hover:bg-yellow-500/10 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

interface OgPreviewOverlayProps {
    deckId: string
    title: string
    children: React.ReactNode
    className?: string
}

export function OgPreviewOverlay({
    deckId,
    title,
    children,
    className = '',
}: OgPreviewOverlayProps) {
    const { enabled, bust } = useOgPreview()
    const url = `/investors/decks/${encodeURIComponent(deckId)}/opengraph-image${
        bust ? `?bust=${bust}` : ''
    }`
    const { src, loading } = useFreshImage(enabled ? url : null)

    if (!enabled) return <>{children}</>

    return (
        <div
            className={`relative rounded-xl overflow-hidden border border-yellow-500/40 bg-black ${className}`}
            style={{ aspectRatio: '1200 / 630' }}
        >
            {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={`OG preview for ${title}`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-yellow-200/55 text-[10px] font-bold uppercase tracking-[0.18em] bg-black/70">
                    <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Rendering OG…
                </div>
            )}
        </div>
    )
}

// Refresh must always hit the network — `?bust=<ts>` already forces a new URL,
// but we additionally request the resource with `cache: 'reload'` so any
// matching browser-cache entry is bypassed and replaced. The result is wrapped
// in an object URL so the <img> renders without going back through the HTTP
// cache. Stale object URLs are revoked on swap.
function useFreshImage(url: string | null) {
    const [resolved, setResolved] = useState<{ url: string; src: string } | null>(null)
    const lastObjectUrl = useRef<string | null>(null)

    useEffect(() => {
        if (!url) return
        let cancelled = false
        fetch(url, { cache: 'reload' })
            .then((res) => res.blob())
            .then((blob) => {
                if (cancelled) return
                const objectUrl = URL.createObjectURL(blob)
                if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
                lastObjectUrl.current = objectUrl
                setResolved({ url, src: objectUrl })
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [url])

    useEffect(() => {
        return () => {
            if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
        }
    }, [])

    const src = resolved?.url === url ? resolved.src : null
    const loading = !!url && src === null
    return { src, loading }
}

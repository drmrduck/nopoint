'use client'
import { createElement, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ArrowLeft,
    Maximize,
    Minimize,
    MessageSquare,
    Mail,
    Home,
    Download,
    MoreVertical,
    PanelRight,
    Keyboard,
    X,
    Send,
    Loader2,
    LayoutGrid,
    Rows3,
    Square,
    Expand,
    Smartphone,
    LogOut,
    BookOpen,
    Share2,
    Lock,
} from 'lucide-react'
import { DECKS } from './index'
import type { DeckChrome, DeckDefinition, SlideDefinition, SlideVariant } from './types'
import { DeckManager } from './deck-manager'
import { ExportMenu } from './export-menu'
import { SlideContextWidget } from './slide-context-widget'
import { SlideControlsWidget } from './slide-controls-widget'
import { ChartcastrDialog } from './chartcastr-dialog'
import { EmbedProvider } from '../../lib/decks/embed-context'
import { isDevMode } from '../../lib/utils/env'
import { prefetchChartcastrSources } from '../../lib/chartcastr/browser-cache'
import { usePreferences } from '../../lib/preferences'
import { PresenceLayer, usePresence } from '../multiplayer/presence-layer'
import { IdentityBar } from '../multiplayer/identity-bar'
import { ContactTooltip } from './contact-tooltip'
import { LocalPromptBlock } from './local-prompt-block'
import { PhoneFrame, ScaledStage, ScaledThumb } from './scaled-stage'
import { SharePanel } from './share-panel'
import {
    loadSlideState,
    loadVariantChoices,
    loadViewMode,
    saveSlideState,
    saveVariantChoices,
    saveViewMode,
    type SlideState,
} from './viewer-state'
import { SLIDE_DESIGN_HEIGHT, SLIDE_DESIGN_WIDTH, type ViewMode } from './viewer-types'

type Panel = 'comment' | 'contact' | 'nav' | 'download' | 'options' | 'shortcuts' | 'share' | null

const VIEW_MODES: ViewMode[] = ['card', 'full', 'grid', 'scroll', 'mobile']

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

const COMMENT_FORWARDING_PROMPT = `I want to wire the in-deck comment system to actually notify me when an investor leaves a comment.

File: app/api/investors/comment/route.ts
Right now the route forwards to a Slack webhook if INVESTOR_COMMENTS_SLACK_WEBHOOK is set, otherwise it just logs to the server console. I want to extend it.

Please ask me, one question at a time:
1. Which channel(s) do you want comments to flow to? Pick any combination of:
   - Slack incoming webhook
   - Discord webhook
   - Email (via Resend, SendGrid, or Postmark — ask which provider)
   - n8n webhook (any custom workflow URL)
   - A custom HTTPS endpoint (POST JSON)
   - Just log to the server console (no notification)
2. For each channel I picked, ask for the URL / API key / from-address / to-address as needed. Confirm the env var names you'll use, e.g. INVESTOR_COMMENTS_SLACK_WEBHOOK, INVESTOR_COMMENTS_DISCORD_WEBHOOK, INVESTOR_COMMENTS_RESEND_API_KEY, INVESTOR_COMMENTS_EMAIL_TO, INVESTOR_COMMENTS_N8N_URL, INVESTOR_COMMENTS_HTTP_URL.
3. Should comments fire-and-forget (don't block the response) or wait for delivery confirmation before responding to the client? (Default: fire-and-forget.)
4. For Slack and Discord, walk me through creating an incoming webhook if I don't already have one (https://api.slack.com/messaging/webhooks for Slack; Server Settings → Integrations → Webhooks for Discord).

Then update app/api/investors/comment/route.ts to POST to all chosen channels in parallel, document each new env var in README.md, and add the keys to .env.local.example if it exists (create one if not).

After my answers, apply the edits and confirm the diff.`

function resolveDeckChrome(deck: DeckDefinition): DeckChrome {
    return {
        brandVisibleFromSlide: deck.chrome?.brandVisibleFromSlide ?? 1,
        brand: deck.chrome?.brand ?? (
            deck.logoUrl
                ? {
                    kind: 'image',
                    src: deck.logoUrl,
                    className: 'h-6 w-auto opacity-40',
                }
                : undefined
        ),
        slideNumber: {
            enabled: deck.chrome?.slideNumber?.enabled ?? true,
            format: deck.chrome?.slideNumber?.format ?? 'padded',
            className:
                deck.chrome?.slideNumber?.className ??
                'text-xs font-semibold tracking-[0.32em] tabular-nums text-white/35',
            containerClassName:
                deck.chrome?.slideNumber?.containerClassName ??
                'absolute top-5 right-16 pointer-events-none select-none z-20',
            prefix: deck.chrome?.slideNumber?.prefix,
            suffix: deck.chrome?.slideNumber?.suffix,
        },
        watermark: {
            text: deck.chrome?.watermark?.text ?? `CONFIDENTIAL — ${deck.title}`,
            className:
                deck.chrome?.watermark?.className ??
                'absolute bottom-4 right-5 text-[11px] text-white/20 pointer-events-none select-none z-20',
        },
    }
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false,
    )
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])
    return reduced
}

function resolveSlideComponent(slide: SlideDefinition, variantKey: string | undefined) {
    if (variantKey && slide.variants?.[variantKey]) {
        return slide.variants[variantKey].component
    }
    if (slide.defaultVariant && slide.variants?.[slide.defaultVariant]) {
        return slide.variants[slide.defaultVariant].component
    }
    return slide.component
}

export interface DeckViewerProps {
    deckId: string
    /**
     * When false, the global keydown listener is not attached. Use this for
     * embedded viewers that should only handle hotkeys while focused/hovered
     * — the host wraps the viewer and toggles this based on focus state.
     */
    keyboardEnabled?: boolean
    /**
     * When true, hides chrome that doesn't make sense outside the investor
     * portal (e.g. the top-left "back to portal" nav links).
     */
    embed?: boolean
}

export function DeckViewer({ deckId, keyboardEnabled = true, embed = false }: DeckViewerProps) {
    const deck = DECKS.find((d) => d.id === deckId) as DeckDefinition
    const deckChrome = useMemo(() => resolveDeckChrome(deck), [deck])
    const defaultOrder = deck.slides.map((s) => s.id)
    const slideMap = useMemo(
        () => Object.fromEntries(deck.slides.map((s) => [s.id, s])),
        [deck],
    )

    const [prefs] = usePreferences()

    const [slideState, setSlideState] = useState<SlideState>(() =>
        loadSlideState(deckId, defaultOrder),
    )

    const initialUrl = useMemo(() => {
        if (typeof window === 'undefined') return { slide: null, view: null, variant: null }
        const sp = new URLSearchParams(window.location.search)
        return {
            slide: sp.get('slide'),
            view: sp.get('view'),
            variant: sp.get('variant'),
        }
    }, [])

    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (initialUrl.view && (VIEW_MODES as string[]).includes(initialUrl.view)) {
            return initialUrl.view as ViewMode
        }
        return loadViewMode(deckId, prefs.defaultViewMode)
    })
    const [variantChoices, setVariantChoices] = useState<Record<string, string>>(() => {
        const stored = loadVariantChoices(deckId)
        if (initialUrl.slide && initialUrl.variant) {
            const slide = slideMap[initialUrl.slide]
            if (slide?.variants?.[initialUrl.variant]) {
                return { ...stored, [initialUrl.slide]: initialUrl.variant }
            }
        }
        return stored
    })

    const orderedEnabled = slideState.order.filter(
        (id) => slideState.enabled.has(id) && slideMap[id],
    )

    const [currentIdx, setCurrentIdx] = useState(() => {
        if (initialUrl.slide) {
            const idx = slideState.order
                .filter((id) => slideState.enabled.has(id) && slideMap[id])
                .indexOf(initialUrl.slide)
            if (idx >= 0) return idx
        }
        return 0
    })
    const [direction, setDirection] = useState(1)
    const [panel, setPanel] = useState<Panel>(null)
    const [managerOpen, setManagerOpen] = useState(false)
    const [contextOpen, setContextOpen] = useState(
        embed ? false : prefs.contextWidgetDefaultOpen || isDevMode(),
    )
    const [controlsOpen, setControlsOpen] = useState(false)
    const [chartcastrOpen, setChartcastrOpen] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [commentStatus, setCommentStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

    const slideRef = useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()

    const safeIdx = Math.min(currentIdx, Math.max(0, orderedEnabled.length - 1))
    const currentSlideId = orderedEnabled[safeIdx]
    const currentSlide = currentSlideId ? slideMap[currentSlideId] : null
    const total = orderedEnabled.length
    const currentSlideNumber = safeIdx + 1
    const currentVariantKey = currentSlide
        ? variantChoices[currentSlide.id] ?? currentSlide.defaultVariant
        : undefined

    // Multiplayer presence: one connection per deck visit, regardless of slide
    // changes or view-mode swaps. Renderers (PresenceLayer) consume this.
    const multiplayerEnabled = !!deck.multiplayer && !embed
    const presence = usePresence(deckId, multiplayerEnabled, currentSlideId ?? '')

    // Peers grouped by slide id — drives the per-slide "# on this slide" badge
    // in the bottom slide switcher.
    const peerCountBySlide = useMemo(() => {
        const map = new Map<string, number>()
        for (const p of presence.peers.values()) {
            if (p.s) map.set(p.s, (map.get(p.s) ?? 0) + 1)
        }
        return map
    }, [presence.peers])

    function updateSlideState(next: SlideState) {
        setSlideState(next)
        saveSlideState(deckId, next)
    }

    function setVariant(slideId: string, variantKey: string) {
        const next = { ...variantChoices, [slideId]: variantKey }
        setVariantChoices(next)
        saveVariantChoices(deckId, next)
    }

    function changeViewMode(next: ViewMode) {
        setViewMode(next)
        saveViewMode(deckId, next)
    }

    const goNext = useCallback(() => {
        setCurrentIdx((idx) => {
            if (idx < total - 1) {
                setDirection(1)
                return idx + 1
            }
            return idx
        })
    }, [total])

    const goPrev = useCallback(() => {
        setCurrentIdx((idx) => {
            if (idx > 0) {
                setDirection(-1)
                return idx - 1
            }
            return idx
        })
    }, [])

    /* Touch swipe — horizontal-dominant, fast-enough swipe on the slide
     * canvas advances/rewinds. Uses refs so it doesn't re-render. */
    const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null)
    const lastSwipeAtRef = useRef(0)
    const onSlideTouchStart = useCallback((e: React.TouchEvent) => {
        const t = e.touches[0]
        if (!t) return
        touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() }
    }, [])
    const onSlideTouchEnd = useCallback((e: React.TouchEvent) => {
        const start = touchStartRef.current
        touchStartRef.current = null
        if (!start) return
        const t = e.changedTouches[0]
        if (!t) return
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        const dt = Date.now() - start.t
        const horiz = Math.abs(dx)
        const vert = Math.abs(dy)
        // Reject taps, vertical scrolls, and slow drifts.
        if (horiz < 40 || horiz < vert * 1.2 || dt > 700) return
        // Guard the EdgeNav onClick from double-firing if the swipe ended on
        // top of the button (the browser may dispatch a click after touchend).
        lastSwipeAtRef.current = Date.now()
        if (dx < 0) goNext()
        else goPrev()
    }, [goNext, goPrev])
    const onEdgeTap = useCallback((step: () => void) => {
        // If a swipe just fired in the last frame, ignore the synthetic click.
        if (Date.now() - lastSwipeAtRef.current < 350) return
        step()
    }, [])

    function togglePanel(p: Panel) {
        setPanel((prev) => {
            const next = prev === p ? null : p
            if (next === 'options') {
                setControlsOpen(false)
                setContextOpen(false)
                setChartcastrOpen(false)
            }
            return next
        })
    }

    function closeAll() {
        setPanel(null)
    }

    function toggleControlsExclusive() {
        setControlsOpen((v) => {
            if (!v) {
                setContextOpen(false)
                setChartcastrOpen(false)
                setPanel((p) => (p === 'options' ? null : p))
            }
            return !v
        })
    }

    function toggleContextExclusive() {
        setContextOpen((v) => {
            if (!v) {
                setControlsOpen(false)
                setChartcastrOpen(false)
                setPanel((p) => (p === 'options' ? null : p))
            }
            return !v
        })
    }

    function toggleChartcastrExclusive() {
        setChartcastrOpen((v) => {
            if (!v) {
                setControlsOpen(false)
                setContextOpen(false)
                setPanel((p) => (p === 'options' ? null : p))
            }
            return !v
        })
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {})
        } else {
            document.exitFullscreen().catch(() => {})
        }
    }

    useEffect(() => {
        function onFsChange() {
            setFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', onFsChange)
        return () => document.removeEventListener('fullscreenchange', onFsChange)
    }, [])

    // Kick off chartcastr prefetch for every source declared on any slide so
    // <ChartcastrSource> renders instantly when the viewer arrives.
    useEffect(() => {
        const ids = deck.slides.flatMap((s) => s.chartcastrSourceIds ?? [])
        if (ids.length) prefetchChartcastrSources(ids)
    }, [deck])

    // URL state sync — write back when state changes
    useEffect(() => {
        if (typeof window === 'undefined' || !currentSlide) return
        const sp = new URLSearchParams(window.location.search)
        sp.set('slide', currentSlide.id)
        sp.set('view', viewMode)
        if (currentVariantKey) {
            sp.set('variant', currentVariantKey)
        } else {
            sp.delete('variant')
        }
        const next = `${window.location.pathname}?${sp.toString()}`
        window.history.replaceState(null, '', next)
    }, [currentSlide, viewMode, currentVariantKey])

    const onKey = useEffectEvent((e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
                e.preventDefault()
                goNext()
                break
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault()
                goPrev()
                break
            case 'f':
                e.preventDefault()
                toggleFullscreen()
                break
            case 'm':
                e.preventDefault()
                setManagerOpen((v) => !v)
                break
            case 'v':
                e.preventDefault()
                changeViewMode(viewMode === 'card' ? 'full' : 'card')
                break
            case 'g':
                e.preventDefault()
                changeViewMode(viewMode === 'grid' ? 'card' : 'grid')
                break
            case 's':
                e.preventDefault()
                changeViewMode(viewMode === 'scroll' ? 'card' : 'scroll')
                break
            case 'p':
                e.preventDefault()
                changeViewMode(viewMode === 'mobile' ? 'card' : 'mobile')
                break
            case 'c':
                e.preventDefault()
                if (currentSlide?.context) toggleContextExclusive()
                break
            case 'Escape':
                e.preventDefault()
                if (panel) setPanel(null)
                else if (chartcastrOpen) setChartcastrOpen(false)
                else if (contextOpen) setContextOpen(false)
                else if (controlsOpen) setControlsOpen(false)
                else if (managerOpen) setManagerOpen(false)
                break
        }
    })

    useEffect(() => {
        if (!keyboardEnabled) return
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [keyboardEnabled])

    async function submitComment() {
        if (!commentText.trim() || !currentSlide) return
        setCommentStatus('sending')
        try {
            const res = await fetch('/api/investors/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deckId,
                    slideNumber: currentSlideNumber,
                    slideTitle: currentSlide.title,
                    comment: commentText,
                }),
            })
            if (!res.ok) throw new Error('comment delivery failed')
            setCommentStatus('sent')
            setCommentText('')
            setTimeout(() => setCommentStatus('idle'), 3000)
        } catch {
            setCommentStatus('idle')
        }
    }

    const transitionsOff = reducedMotion || !prefs.transitionsEnabled
    const transition = transitionsOff
        ? { duration: 0 }
        : { duration: 0.28, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
    const variants = {
        enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
    }

    const showChrome = viewMode === 'card' || viewMode === 'full' || viewMode === 'mobile'
    const slideNumberChrome = deckChrome.slideNumber
    const slideNumberText = slideNumberChrome?.format === 'plain'
        ? String(currentSlideNumber)
        : String(currentSlideNumber).padStart(2, '0')

    return (
        <EmbedProvider value={embed}>
        <div className="relative h-full w-full bg-zinc-950 select-none overflow-hidden">
            {/* Slide canvas — depends on view mode */}
            {showChrome && currentSlide && (
                <div
                    ref={slideRef}
                    className="absolute inset-0"
                    onTouchStart={onSlideTouchStart}
                    onTouchEnd={onSlideTouchEnd}
                >
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`${currentSlide.id}-${currentVariantKey ?? 'default'}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={transition}
                            className={
                                viewMode === 'full'
                                    ? 'absolute inset-0'
                                    : viewMode === 'mobile'
                                        ? 'absolute inset-0 flex items-center justify-center px-4 py-6 sm:py-10'
                                        : 'absolute inset-0 flex items-center justify-center px-3 py-3 sm:px-16 sm:py-8 lg:px-24 lg:py-10'
                            }
                        >
                            {viewMode === 'full' ? (
                                <div className="relative h-full w-full">
                                    <ScaledStage>
                                        <SlideContent slide={currentSlide} variantKey={currentVariantKey} />
                                        {multiplayerEnabled && currentSlideId && (
                                            <PresenceLayer presence={presence} slideId={currentSlideId} />
                                        )}
                                    </ScaledStage>
                                    <SlideFrameChrome
                                        deckChrome={deckChrome}
                                        currentSlideNumber={currentSlideNumber}
                                        slideNumberText={slideNumberText}
                                        showNumber={prefs.showNumberWatermark && total > 0}
                                        showWatermark={prefs.showConfidentialWatermark}
                                    />
                                </div>
                            ) : viewMode === 'mobile' ? (
                                <PhoneFrame>
                                    <ScaledStage mode="fit">
                                        <SlideContent slide={currentSlide} variantKey={currentVariantKey} />
                                        {multiplayerEnabled && currentSlideId && (
                                            <PresenceLayer presence={presence} slideId={currentSlideId} />
                                        )}
                                    </ScaledStage>
                                </PhoneFrame>
                            ) : (
                                <div
                                    className="relative bg-zinc-950 shadow-2xl rounded-xl overflow-hidden"
                                    style={{
                                        aspectRatio: `${SLIDE_DESIGN_WIDTH} / ${SLIDE_DESIGN_HEIGHT}`,
                                        width: `min(100%, calc(100vh * ${SLIDE_DESIGN_WIDTH} / ${SLIDE_DESIGN_HEIGHT} - 80px))`,
                                    }}
                                >
                                    <ScaledStage mode="fill">
                                        <SlideContent slide={currentSlide} variantKey={currentVariantKey} />
                                        {multiplayerEnabled && currentSlideId && (
                                            <PresenceLayer presence={presence} slideId={currentSlideId} />
                                        )}
                                    </ScaledStage>
                                    <SlideFrameChrome
                                        deckChrome={deckChrome}
                                        currentSlideNumber={currentSlideNumber}
                                        slideNumberText={slideNumberText}
                                        showNumber={prefs.showNumberWatermark && total > 0}
                                        showWatermark={prefs.showConfidentialWatermark}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Edge nav — left / right tap zones with chevron arrows.
                     * Visible on small viewports (and always in mobile preview)
                     * because the desktop bottom-bar prev/next is too far for a
                     * thumb. Tapping anywhere in the zone advances / rewinds.
                     * Sits at 25% of the canvas width on each side so taps in
                     * the middle still reach slide content. */}
                    <EdgeNav
                        side="left"
                        smOnly={viewMode !== 'mobile'}
                        disabled={safeIdx === 0}
                        onTap={() => onEdgeTap(goPrev)}
                    />
                    <EdgeNav
                        side="right"
                        smOnly={viewMode !== 'mobile'}
                        disabled={safeIdx === total - 1}
                        onTap={() => onEdgeTap(goNext)}
                    />
                </div>
            )}

            {viewMode === 'grid' && (
                <GridView
                    orderedEnabled={orderedEnabled}
                    slideMap={slideMap}
                    variantChoices={variantChoices}
                    currentIdx={safeIdx}
                    onPick={(idx) => {
                        setDirection(idx > safeIdx ? 1 : -1)
                        setCurrentIdx(idx)
                        changeViewMode('card')
                    }}
                />
            )}

            {viewMode === 'scroll' && (
                <ScrollView
                    orderedEnabled={orderedEnabled}
                    slideMap={slideMap}
                    variantChoices={variantChoices}
                    onPick={(idx) => {
                        setDirection(idx > safeIdx ? 1 : -1)
                        setCurrentIdx(idx)
                        changeViewMode('card')
                    }}
                />
            )}

            {!embed && (
                <div className="absolute left-16 top-5 z-30 flex items-center gap-2">
                    <TopNavLink href="/investors/portal" title="Back to investor portal">
                        <ArrowLeft className="h-4 w-4" />
                    </TopNavLink>
                    <TopNavLink href="/investors/portal" title="Investor portal home">
                        <Home className="h-4 w-4" />
                    </TopNavLink>
                </div>
            )}

            {/* Top-right widget rail: 3-dots options + live Controls + Context, all in one row.
                In embed mode, only show while focused/controlled — otherwise the demo looks busy.
                On narrow viewports inside an embed, hide entirely so the small canvas isn't cluttered
                with chrome — investors on phones get prev/next + tap zones, which is enough. */}
            {showChrome && (!embed || keyboardEnabled) && (
                <div className={cx(
                    'absolute top-4 right-4 z-40 items-start gap-2',
                    embed ? 'hidden sm:flex' : 'flex',
                )}>
                    <div className="relative">
                        <button
                            title="Options"
                            onClick={() => togglePanel('options')}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                panel === 'options' || panel === 'shortcuts'
                                    ? 'bg-white/15 text-white'
                                    : 'bg-white/10 hover:bg-white/15 text-white/60 hover:text-white'
                            }`}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {panel === 'options' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: reducedMotion ? 0 : 0.12 }}
                                    className="absolute top-10 right-0 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    <OptionsMenuItem
                                        icon={fullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                                        label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                                        shortcut="F"
                                        onClick={() => { toggleFullscreen(); closeAll() }}
                                    />
                                    <OptionsMenuItem
                                        icon={<PanelRight className="w-4 h-4" />}
                                        label="Slide manager"
                                        shortcut="M"
                                        onClick={() => { setManagerOpen(true); closeAll() }}
                                    />
                                    <OptionsMenuItem
                                        icon={<Keyboard className="w-4 h-4" />}
                                        label="Keyboard shortcuts"
                                        onClick={() => { setPanel('shortcuts') }}
                                    />
                                    <div className="h-px bg-white/8 my-1" />
                                    <OptionsMenuItem
                                        icon={<Home className="w-4 h-4" />}
                                        label="Portal home"
                                        onClick={() => { window.location.href = '/investors/portal' }}
                                    />
                                    <OptionsMenuItem
                                        icon={<BookOpen className="w-4 h-4" />}
                                        label="Deck library"
                                        onClick={() => { window.location.href = '/investors/decks' }}
                                    />
                                    <div className="h-px bg-white/8 my-1" />
                                    <OptionsMenuItem
                                        icon={<LogOut className="w-4 h-4" />}
                                        label="Sign out"
                                        onClick={async () => {
                                            await fetch('/api/investors/logout', { method: 'POST' })
                                            window.location.href = '/investors/login'
                                        }}
                                    />
                                </motion.div>
                            )}
                            {panel === 'shortcuts' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: reducedMotion ? 0 : 0.12 }}
                                    className="absolute top-10 right-0 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 z-50"
                                >
                                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                                        Shortcuts
                                    </p>
                                    <div className="space-y-2 text-xs">
                                        {[
                                            ['→ / ↓ / Space', 'Next slide'],
                                            ['← / ↑', 'Previous slide'],
                                            ['V', 'Toggle card / full'],
                                            ['G', 'Grid view'],
                                            ['S', 'Scroll view'],
                                            ['P', 'Mobile preview'],
                                            ['F', 'Toggle fullscreen'],
                                            ['M', 'Toggle manager'],
                                            ['C', 'Slide context'],
                                            ['Esc', 'Close panels'],
                                        ].map(([key, desc]) => (
                                            <div key={key} className="flex justify-between">
                                                <kbd className="text-white/30 font-mono">{key}</kbd>
                                                <span className="text-white/50">{desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {currentSlide?.controls && (
                        <SlideControlsWidget
                            slide={currentSlide}
                            open={controlsOpen}
                            onToggle={toggleControlsExclusive}
                        />
                    )}
                    {currentSlide?.context && (
                        <SlideContextWidget
                            context={currentSlide.context}
                            open={contextOpen}
                            onToggle={toggleContextExclusive}
                        />
                    )}
                    {isDevMode() && (
                        <ChartcastrDialog
                            open={chartcastrOpen}
                            onToggle={toggleChartcastrExclusive}
                            onClose={() => setChartcastrOpen(false)}
                        />
                    )}
                </div>
            )}

            {/* Multiplayer identity chip (bottom-left) */}
            {showChrome && multiplayerEnabled && (
                <IdentityBar deckId={deckId} peerCount={presence.peerCount} />
            )}


            {/* Variant button-group (top-center, when slide has variants) */}
            {showChrome && currentSlide?.variants && Object.keys(currentSlide.variants).length > 0 && (
                <VariantPicker
                    variants={currentSlide.variants}
                    current={currentVariantKey}
                    onPick={(key) => setVariant(currentSlide.id, key)}
                />
            )}

            {/* Left-margin 4-button rail. Hidden on narrow viewports (< sm) so
             * it doesn't overlap the slide — those actions are still reachable
             * via the options menu / bottom bar. In embed mode, also hidden
             * until the deck is focused/controlled, matching the top-right rail. */}
            {showChrome && (!embed || keyboardEnabled) && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2 z-30">
                    <RailButton
                        icon={<MessageSquare className="w-4 h-4" />}
                        title="Leave a comment"
                        active={panel === 'comment'}
                        onClick={() => togglePanel('comment')}
                    />
                    <RailButton
                        icon={<Mail className="w-4 h-4" />}
                        title="Contact founder"
                        active={panel === 'contact'}
                        onClick={() => togglePanel('contact')}
                    />
                    <RailButton
                        icon={<Download className="w-4 h-4" />}
                        title="Download / export"
                        active={panel === 'download'}
                        onClick={() => togglePanel('download')}
                    />
                    <RailButton
                        icon={
                            deck.public ? (
                                <Share2 className="w-4 h-4" />
                            ) : (
                                <Lock className="w-4 h-4" />
                            )
                        }
                        title={deck.public ? 'Share this deck' : 'Private deck — share disabled'}
                        active={panel === 'share'}
                        onClick={() => togglePanel('share')}
                    />
                </div>
            )}

            {/* Rail panels */}
            <AnimatePresence>
                {panel === 'comment' && (
                    <RailPanel key="comment" onClose={closeAll}>
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                            Question or comment
                        </p>
                        <p className="text-xs text-white/30 mb-2">
                            Slide {currentSlideNumber} — {currentSlide?.title}
                        </p>
                        {commentStatus === 'sent' ? (
                            <p className="text-sm text-green-400">Sent — thank you!</p>
                        ) : (
                            <>
                                <textarea
                                    autoFocus
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitComment()
                                    }}
                                    placeholder="Ask a question or leave a note…"
                                    className="w-full h-28 text-sm bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 resize-none"
                                />
                                <button
                                    onClick={submitComment}
                                    disabled={!commentText.trim() || commentStatus === 'sending'}
                                    className="mt-2 w-full h-9 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    {commentStatus === 'sending' ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5" />
                                    )}
                                    {commentStatus === 'sending' ? 'Sending…' : 'Send (⌘↵)'}
                                </button>
                            </>
                        )}
                        <LocalPromptBlock
                            badge="Wire up notifications"
                            title="Get comments delivered to Slack / Discord / email / n8n"
                            description="Default behaviour is server-console log only. Copy this prompt into Claude Code and it will ask you channel-by-channel and update the route handler + env vars."
                            prompt={COMMENT_FORWARDING_PROMPT}
                            defaultOpen
                        />
                    </RailPanel>
                )}

                {panel === 'contact' && (
                    <RailPanel key="contact" onClose={closeAll}>
                        <ContactTooltip deckContact={deck.contact} />
                    </RailPanel>
                )}

                {panel === 'download' && currentSlide && (
                    <RailPanel key="download" onClose={closeAll}>
                        <ExportMenu
                            deck={deck}
                            currentSlideIdx={safeIdx}
                            orderedEnabled={orderedEnabled}
                            slideMap={slideMap}
                            variantChoices={variantChoices}
                            slideRef={slideRef}
                        />
                    </RailPanel>
                )}

                {panel === 'share' && (
                    <RailPanel key="share" onClose={closeAll}>
                        <SharePanel
                            deck={deck}
                            currentSlideId={currentSlide?.id}
                            currentSlideTitle={currentSlide?.title}
                            currentSlideNumber={currentSlideNumber}
                            viewMode={viewMode}
                            currentVariantKey={currentVariantKey}
                        />
                    </RailPanel>
                )}
            </AnimatePresence>

            {/* Bottom bar — always visible. Slide-specific controls (prev/next, count, smart pills) only render in card/full mode. */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-14 flex items-center px-3 sm:px-16 gap-2 sm:gap-3 transition-opacity z-20 ${
                    prefs.autoHideChrome
                        ? 'opacity-0 hover:opacity-100 focus-within:opacity-100'
                        : 'opacity-100'
                }`}
            >
                {showChrome ? (
                    <>
                        <div className="flex items-center gap-1.5">
                            <button
                                title="Previous slide"
                                onClick={goPrev}
                                disabled={safeIdx === 0}
                                className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/12 disabled:opacity-25 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="text-xs text-white/45 tabular-nums w-12 text-center">
                                {currentSlideNumber} / {total}
                            </span>

                            <button
                                title="Next slide"
                                onClick={goNext}
                                disabled={safeIdx === total - 1}
                                className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/12 disabled:opacity-25 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Spacer on narrow viewports — pushes ViewModeGroup to the right
                         * since the smart-pills row is hidden. */}
                        <div className="flex-1 sm:hidden" />

                        {/* Smart pills: 2 nearest each side get text labels, others stay dots.
                         * Hidden on narrow viewports (< sm) — prev/next + count are enough. */}
                        <div className="hidden sm:flex items-center gap-1.5 flex-1 justify-center min-w-0">
                            {orderedEnabled.map((id, i) => {
                                const dist = Math.abs(i - safeIdx)
                                const isText = dist <= 2
                                const slide = slideMap[id]
                                const isCurrent = i === safeIdx
                                const peerCount = peerCountBySlide.get(id) ?? 0
                                const showBadge = multiplayerEnabled && !isCurrent && peerCount > 0
                                const badgeTitle = peerCount === 1
                                    ? '1 viewer on this slide'
                                    : `${peerCount} viewers on this slide`
                                return (
                                    <span key={id} className="relative shrink-0 inline-flex">
                                        <button
                                            title={showBadge ? `${slide?.title ?? ''} · ${badgeTitle}` : slide?.title}
                                            onClick={() => {
                                                setDirection(i > safeIdx ? 1 : -1)
                                                setCurrentIdx(i)
                                            }}
                                            className={`rounded-full transition-all shrink-0 flex items-center justify-center ${
                                                isCurrent
                                                    ? isText
                                                        ? 'h-7 px-3.5 bg-blue-500 text-[11px] font-bold uppercase tracking-wider text-white max-w-[160px] truncate'
                                                        : 'w-4 h-1.5 bg-blue-500'
                                                    : isText
                                                        ? 'h-7 px-3 bg-white/8 hover:bg-white/14 text-[11px] font-medium uppercase tracking-wider text-white/55 hover:text-white max-w-[130px] truncate'
                                                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                                            }`}
                                        >
                                            {isText ? slide?.title : null}
                                        </button>
                                        {showBadge && (
                                            <span
                                                aria-label={badgeTitle}
                                                className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-blue-500 text-white text-[9px] leading-none font-bold tabular-nums ring-2 ring-zinc-950 shadow-sm"
                                            >
                                                {peerCount > 9 ? '9+' : peerCount}
                                            </span>
                                        )}
                                    </span>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center gap-3 text-xs text-white/40 px-2">
                        <span className="uppercase tracking-[0.18em] font-semibold text-white/55">
                            {viewMode === 'grid' ? 'Grid' : 'List'} view
                        </span>
                        <span className="text-white/20">·</span>
                        <span>{total} slide{total === 1 ? '' : 's'}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/35 hidden sm:inline">click a slide to open it</span>
                    </div>
                )}

                {/* View-mode + slide-manager controls. Hidden on narrow viewports inside an
                    embed so the cramped bottom bar only carries prev/next + slide count. */}
                <div className={cx('items-center gap-2 sm:gap-3', embed ? 'hidden sm:flex' : 'flex')}>
                    <ViewModeGroup
                        current={viewMode}
                        onChange={changeViewMode}
                        fullscreen={fullscreen}
                        onToggleFullscreen={toggleFullscreen}
                        compact={embed}
                    />

                    <button
                        title="Slide manager"
                        onClick={() => setManagerOpen((v) => !v)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-colors ${
                            managerOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-white/8 hover:bg-white/12'
                        }`}
                    >
                        <PanelRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Slide manager drawer */}
            <DeckManager
                deck={deck}
                slideState={slideState}
                onSlideStateChange={updateSlideState}
                onNavigate={(idx) => {
                    setDirection(idx > safeIdx ? 1 : -1)
                    setCurrentIdx(idx)
                }}
                open={managerOpen}
                onClose={() => setManagerOpen(false)}
            />

            {/* Click outside to close rail panels */}
            {panel && (
                <div
                    className="absolute inset-0 z-20"
                    onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (!target.closest('[data-rail-panel]') && !target.closest('[data-rail-button]')) {
                            closeAll()
                        }
                    }}
                />
            )}
        </div>
        </EmbedProvider>
    )
}

function SlideContent({
    slide,
    variantKey,
}: {
    slide: SlideDefinition
    variantKey: string | undefined
}) {
    return createElement(resolveSlideComponent(slide, variantKey))
}

function SlideFrameChrome({
    deckChrome,
    currentSlideNumber,
    slideNumberText,
    showNumber,
    showWatermark,
}: {
    deckChrome: DeckChrome
    currentSlideNumber: number
    slideNumberText: string
    showNumber: boolean
    showWatermark: boolean
}) {
    const brandVisible = !!deckChrome.brand && currentSlideNumber >= (deckChrome.brandVisibleFromSlide ?? 1)
    const slideNumberVisible = showNumber && deckChrome.slideNumber?.enabled !== false && !!deckChrome.slideNumber
    const watermarkVisible = showWatermark && !!deckChrome.watermark?.text

    if (!brandVisible && !slideNumberVisible && !watermarkVisible) return null

    return (
        <>
            {brandVisible && (
                <div
                    className={cx(
                        'absolute top-5 left-6 pointer-events-none select-none z-20',
                        deckChrome.brand?.containerClassName,
                    )}
                >
                    {deckChrome.brand?.kind === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={deckChrome.brand.src}
                            alt={deckChrome.brand.alt ?? ''}
                            aria-hidden={deckChrome.brand.alt ? undefined : true}
                            className={cx('h-6 w-auto', deckChrome.brand.className)}
                        />
                    ) : (
                        <span
                            className={cx(
                                'text-xs font-semibold uppercase tracking-[0.28em] text-white/32',
                                deckChrome.brand?.className,
                            )}
                        >
                            {deckChrome.brand?.text}
                        </span>
                    )}
                </div>
            )}

            {slideNumberVisible && deckChrome.slideNumber && (
                <div className={deckChrome.slideNumber.containerClassName}>
                    <span className={deckChrome.slideNumber.className}>
                        {deckChrome.slideNumber.prefix}
                        {slideNumberText}
                        {deckChrome.slideNumber.suffix}
                    </span>
                </div>
            )}

            {watermarkVisible && (
                <div className={deckChrome.watermark?.className}>
                    {deckChrome.watermark?.text}
                </div>
            )}
        </>
    )
}

interface ModeItem {
    key: 'card' | 'full' | 'grid' | 'scroll' | 'mobile' | 'screen'
    icon: React.ReactNode
    label: string
    title: string
    /** Hide this item on narrow viewports (< sm) to reclaim space. */
    smOnly?: boolean
}

function ViewModeGroup({
    current,
    onChange,
    fullscreen,
    onToggleFullscreen,
    compact = false,
}: {
    current: ViewMode
    onChange: (m: ViewMode) => void
    fullscreen: boolean
    onToggleFullscreen: () => void
    /** Render as an icon-only select dropdown instead of a button group. */
    compact?: boolean
}) {
    const items: ModeItem[] = [
        { key: 'card', icon: <Square className="w-3.5 h-3.5" />, label: 'Card', title: 'Card view (V)' },
        { key: 'full', icon: <Expand className="w-3.5 h-3.5" />, label: 'Full', title: 'Full bleed (V)' },
        { key: 'grid', icon: <LayoutGrid className="w-3.5 h-3.5" />, label: 'Grid', title: 'Grid view (G)' },
        { key: 'scroll', icon: <Rows3 className="w-3.5 h-3.5" />, label: 'List', title: 'Scroll / list view (S)', smOnly: true },
        { key: 'mobile', icon: <Smartphone className="w-3.5 h-3.5" />, label: 'Mobile', title: 'Mobile preview (P)' },
        {
            // Fullscreen is hidden on narrow viewports — the API has spotty
            // mobile-browser support and the button is rarely useful there.
            key: 'screen',
            icon: fullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />,
            label: 'Screen',
            title: fullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)',
            smOnly: true,
        },
    ]

    function handle(key: ModeItem['key']) {
        if (key === 'screen') onToggleFullscreen()
        else onChange(key)
    }

    function isActive(key: ModeItem['key']) {
        if (key === 'screen') return fullscreen
        return current === key
    }

    if (compact) {
        return (
            <ViewModeSelect
                items={items}
                onPick={handle}
                isActive={isActive}
            />
        )
    }

    return (
        <div className="flex items-center gap-0.5 sm:gap-1 p-1 bg-white/5 rounded-lg">
            {items.map((it) => {
                const active = isActive(it.key)
                return (
                    <button
                        key={it.key}
                        title={it.title}
                        onClick={() => handle(it.key)}
                        className={cx(
                            'h-7 flex items-center gap-1.5 rounded-md transition-all',
                            it.smOnly && 'hidden sm:flex',
                            active
                                ? 'bg-blue-500/25 text-blue-200 px-1.5 w-7 justify-center'
                                : 'px-1.5 sm:px-2.5 text-white/55 hover:text-white hover:bg-white/8',
                        )}
                    >
                        {it.icon}
                        {!active && (
                            <span className="hidden sm:inline text-[11px] font-medium">{it.label}</span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

function ViewModeSelect({
    items,
    onPick,
    isActive,
}: {
    items: ModeItem[]
    onPick: (key: ModeItem['key']) => void
    isActive: (key: ModeItem['key']) => boolean
}) {
    const [open, setOpen] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)
    const current = items.find((i) => isActive(i.key)) ?? items[0]!

    useEffect(() => {
        if (!open) return
        const onDoc = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('mousedown', onDoc)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onDoc)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                title={current.title}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="h-8 inline-flex items-center gap-1.5 pl-2 pr-1.5 rounded-md border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08] text-white/80 hover:text-white transition-colors"
            >
                {current.icon}
                <span className="text-[11px] font-medium">{current.label}</span>
                <ChevronDown className={cx('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
                <div
                    role="listbox"
                    className="absolute bottom-full mb-2 right-0 z-40 min-w-[140px] rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur p-1 shadow-xl"
                >
                    {items.map((it) => {
                        const active = isActive(it.key)
                        return (
                            <button
                                key={it.key}
                                role="option"
                                aria-selected={active}
                                title={it.title}
                                onClick={() => { onPick(it.key); setOpen(false) }}
                                className={cx(
                                    'w-full flex items-center gap-2 px-2 h-8 rounded-md text-[11px] font-medium transition-colors',
                                    active
                                        ? 'bg-blue-500/25 text-blue-200'
                                        : 'text-white/70 hover:text-white hover:bg-white/8',
                                )}
                            >
                                <span className="w-4 inline-flex justify-center">{it.icon}</span>
                                <span>{it.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function VariantPicker({
    variants,
    current,
    onPick,
}: {
    variants: Record<string, SlideVariant>
    current: string | undefined
    onPick: (key: string) => void
}) {
    const entries = Object.entries(variants)
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <div className="flex items-center bg-zinc-900/95 border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3">
                    Variant
                </span>
                {entries.map(([key, variant]) => (
                    <button
                        key={key}
                        onClick={() => onPick(key)}
                        className={`px-3 h-8 text-xs font-medium transition-colors ${
                            current === key
                                ? 'bg-blue-500/30 text-blue-200'
                                : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

function GridView({
    orderedEnabled,
    slideMap,
    variantChoices,
    currentIdx,
    onPick,
}: {
    orderedEnabled: string[]
    slideMap: Record<string, SlideDefinition>
    variantChoices: Record<string, string>
    currentIdx: number
    onPick: (idx: number) => void
}) {
    return (
        <div className="absolute inset-0 overflow-y-auto p-6 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {orderedEnabled.map((id, i) => {
                    const slide = slideMap[id]
                    if (!slide) return null
                    const variantKey = variantChoices[id] ?? slide.defaultVariant
                    return (
                        <button
                            key={id}
                            onClick={() => onPick(i)}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                                i === currentIdx
                                    ? 'border-blue-500 shadow-xl shadow-blue-500/20'
                                    : 'border-white/10 hover:border-white/30'
                            }`}
                        >
                            <ScaledThumb>
                                <SlideContent slide={slide} variantKey={variantKey} />
                            </ScaledThumb>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                <p className="text-xs text-white/40 tabular-nums">{i + 1}</p>
                                <p className="text-sm text-white font-medium truncate">{slide.title}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function ScrollView({
    orderedEnabled,
    slideMap,
    variantChoices,
    onPick,
}: {
    orderedEnabled: string[]
    slideMap: Record<string, SlideDefinition>
    variantChoices: Record<string, string>
    onPick: (idx: number) => void
}) {
    return (
        <div className="absolute inset-0 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
                {orderedEnabled.map((id, i) => {
                    const slide = slideMap[id]
                    if (!slide) return null
                    const variantKey = variantChoices[id] ?? slide.defaultVariant
                    return (
                        <button
                            key={id}
                            onDoubleClick={() => onPick(i)}
                            className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors text-left"
                            style={{ aspectRatio: '16 / 9' }}
                        >
                            <ScaledThumb>
                                <SlideContent slide={slide} variantKey={variantKey} />
                            </ScaledThumb>
                            <div className="absolute top-3 left-3 text-xs font-semibold bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 text-white/80 tabular-nums">
                                {i + 1} — {slide.title}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function EdgeNav({
    side,
    smOnly,
    disabled,
    onTap,
}: {
    side: 'left' | 'right'
    /**
     * When true, the entire control hides on viewports >= sm. Used in
     * card/full views where the bottom-bar prev/next button already covers
     * the desktop case. In mobile-preview view we want it on every viewport.
     */
    smOnly: boolean
    disabled: boolean
    onTap: () => void
}) {
    if (disabled) return null
    const isLeft = side === 'left'
    return (
        <button
            type="button"
            aria-label={isLeft ? 'Previous slide' : 'Next slide'}
            onClick={onTap}
            className={cx(
                'absolute top-0 bottom-0 w-[28%] max-w-[180px] z-10 flex items-center group',
                // Visible on touch viewports (no hover available); hidden by
                // default on desktop and revealed on hover/focus.
                'opacity-70 sm:opacity-0 sm:hover:opacity-100 sm:focus-visible:opacity-100 transition-opacity',
                isLeft ? 'left-0 justify-start pl-2 sm:pl-3' : 'right-0 justify-end pr-2 sm:pr-3',
                smOnly && 'sm:hidden',
            )}
        >
            <span className="rounded-full p-2 bg-black/55 backdrop-blur-sm ring-1 ring-white/10 text-white/90 group-hover:bg-black/70 group-active:bg-blue-500/50 transition-colors">
                {isLeft ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </span>
        </button>
    )
}

function TopNavLink({
    href,
    title,
    children,
}: {
    href: string
    title: string
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            title={title}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
            {children}
        </Link>
    )
}

function RailButton({
    icon,
    title,
    active,
    onClick,
}: {
    icon: React.ReactNode
    title: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            data-rail-button
            title={title}
            onClick={onClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors z-30 relative ${
                active
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-black/40 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
        >
            {icon}
        </button>
    )
}

function RailPanel({
    children,
    onClose,
}: {
    children: React.ReactNode
    onClose: () => void
}) {
    return (
        <motion.div
            data-rail-panel
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-14 top-1/2 -translate-y-1/2 w-72 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl p-4 z-30"
        >
            <button
                onClick={onClose}
                title="Close"
                className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            {children}
        </motion.div>
    )
}

function OptionsMenuItem({
    icon,
    label,
    shortcut,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    shortcut?: string
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
            <span className="text-white/40">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            {shortcut && (
                <kbd className="text-xs text-white/20 font-mono">{shortcut}</kbd>
            )}
        </button>
    )
}

'use client'
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowLeft,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Download,
    Home,
    Keyboard,
    Loader2,
    Lock,
    LogOut,
    Mail,
    Maximize,
    MessageSquare,
    Minimize,
    MoreVertical,
    PanelRight,
    Send,
    Share2,
} from 'lucide-react'
import { DECKS } from '../index'
import type { DeckDefinition } from '../types'
import { DeckManager } from '../deck-manager'
import { ExportMenu } from '../export-menu'
import { SlideContextWidget } from '../slide-context-widget'
import { SlideControlsWidget } from '../slide-controls-widget'
import { ChartcastrDialog } from '../chartcastr-dialog'
import { EmbedProvider } from '../../../lib/decks/embed-context'
import { isDevMode } from '../../../lib/utils/env'
import { prefetchChartcastrSources } from '../../../lib/chartcastr/browser-cache'
import { usePreferences } from '../../../lib/preferences'
import { PresenceLayer, usePresence } from '../../multiplayer/presence-layer'
import { IdentityBar } from '../../multiplayer/identity-bar'
import { ContactTooltip } from '../contact-tooltip'
import { LocalPromptBlock } from '../local-prompt-block'
import { PhoneFrame, ScaledStage } from '../scaled-stage'
import { SharePanel } from '../share-panel'
import {
    loadSlideState,
    loadVariantChoices,
    loadViewMode,
    saveSlideState,
    saveVariantChoices,
    saveViewMode,
    type SlideState,
} from '../viewer-state'
import { SLIDE_DESIGN_HEIGHT, SLIDE_DESIGN_WIDTH, type ViewMode } from '../viewer-types'
import { cx, resolveDeckChrome } from './utils'
import { useReducedMotion } from './use-reduced-motion'
import { COMMENT_FORWARDING_PROMPT } from './comment-forwarding-prompt'
import { SlideContent } from './slide-content'
import { SlideFrameChrome } from './slide-frame-chrome'
import { ViewModeGroup } from './view-mode-group'
import { VariantPicker } from './variant-picker'
import { GridView } from './grid-view'
import { ScrollView } from './scroll-view'
import { EdgeNav } from './edge-nav'
import { TopNavLink } from './top-nav-link'
import { RailButton, RailPanel } from './rail'
import { OptionsMenuItem } from './options-menu-item'

type Panel = 'comment' | 'contact' | 'nav' | 'download' | 'options' | 'shortcuts' | 'share' | null

const VIEW_MODES: ViewMode[] = ['card', 'full', 'grid', 'scroll', 'mobile']

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
                                        <SlideFrameChrome
                                            deckChrome={deckChrome}
                                            currentSlideNumber={currentSlideNumber}
                                            slideNumberText={slideNumberText}
                                            showNumber={prefs.showNumberWatermark && total > 0}
                                            showWatermark={prefs.showConfidentialWatermark}
                                        />
                                    </ScaledStage>
                                </div>
                            ) : viewMode === 'mobile' ? (
                                <PhoneFrame>
                                    <ScaledStage mode="fit">
                                        <SlideContent slide={currentSlide} variantKey={currentVariantKey} />
                                        {multiplayerEnabled && currentSlideId && (
                                            <PresenceLayer presence={presence} slideId={currentSlideId} />
                                        )}
                                        <SlideFrameChrome
                                            deckChrome={deckChrome}
                                            currentSlideNumber={currentSlideNumber}
                                            slideNumberText={slideNumberText}
                                            showNumber={prefs.showNumberWatermark && total > 0}
                                            showWatermark={prefs.showConfidentialWatermark}
                                        />
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
                                        <SlideFrameChrome
                                            deckChrome={deckChrome}
                                            currentSlideNumber={currentSlideNumber}
                                            slideNumberText={slideNumberText}
                                            showNumber={prefs.showNumberWatermark && total > 0}
                                            showWatermark={prefs.showConfidentialWatermark}
                                        />
                                    </ScaledStage>
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

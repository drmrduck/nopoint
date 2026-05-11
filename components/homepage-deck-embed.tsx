'use client'

import { useEffect, useRef, useState } from 'react'
import { Keyboard, MousePointerClick } from 'lucide-react'
import { DeckViewer } from '@/components/decks/deck-viewer'

interface PublicDeckSummary {
    id: string
    title: string
    slideCount: number
}

export function HomepageDeckEmbed({ decks }: { decks: PublicDeckSummary[] }) {
    const [activeId, setActiveId] = useState(decks[0]?.id ?? '')
    const [focused, setFocused] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Auto-focus rules:
    // - Never auto-focus on initial mount; respect the user's actual scroll position.
    // - 3s grace period after page load. While the timer is running, only allow
    //   auto-focus when the deck is 100% inside the viewport (the user has clearly
    //   scrolled to it). After the timer, ≥90% in view is enough.
    // - Direct interaction (click, pointer, keyboard) always focuses immediately —
    //   the timer never blocks an explicit user action.
    // - Don't steal focus from real inputs.
    useEffect(() => {
        const el = containerRef.current
        if (!el || typeof IntersectionObserver === 'undefined') return

        let autoFocusUnlocked = false
        const unlockTimer = window.setTimeout(() => {
            autoFocusUnlocked = true
        }, 3000)

        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (!entry) return
                // Visible fraction relative to the smaller of element/viewport height.
                // Hits 1.0 when the deck either fits entirely in the viewport or
                // entirely fills it (deck taller than viewport).
                const root = entry.rootBounds
                const denom = root
                    ? Math.min(root.height, entry.boundingClientRect.height)
                    : entry.boundingClientRect.height
                const visibleFraction =
                    denom > 0 ? entry.intersectionRect.height / denom : 0

                const active = document.activeElement as HTMLElement | null
                const activeIsTypable =
                    !!active &&
                    active !== document.body &&
                    !el.contains(active) &&
                    (active.tagName === 'INPUT' ||
                        active.tagName === 'TEXTAREA' ||
                        active.tagName === 'SELECT' ||
                        active.isContentEditable)

                const fullyVisible = visibleFraction >= 0.999
                const focusEligible = fullyVisible || (visibleFraction >= 0.9 && autoFocusUnlocked)

                if (focusEligible) {
                    if (activeIsTypable) return
                    if (document.activeElement !== el) {
                        el.focus({ preventScroll: true })
                    }
                } else if (visibleFraction < 0.5) {
                    if (el.contains(document.activeElement)) {
                        ;(document.activeElement as HTMLElement)?.blur()
                    }
                }
            },
            { threshold: [0, 0.5, 0.9, 1] },
        )
        io.observe(el)
        return () => {
            window.clearTimeout(unlockTimer)
            io.disconnect()
        }
    }, [])

    if (!activeId) {
        return (
            <div className="h-full grid place-items-center text-white/40 text-sm">
                No public decks configured.
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col gap-3">
            <div
                ref={containerRef}
                tabIndex={0}
                role="region"
                aria-label="Pitch deck preview"
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                    const next = e.relatedTarget as Node | null
                    if (next && containerRef.current?.contains(next)) return
                    setFocused(false)
                }}
                onPointerDown={() => {
                    if (document.activeElement && containerRef.current?.contains(document.activeElement)) return
                    containerRef.current?.focus({ preventScroll: true })
                }}
                onPointerEnter={() => {
                    const el = containerRef.current
                    if (!el || el.contains(document.activeElement)) return
                    el.focus({ preventScroll: true })
                }}
                onMouseMove={() => {
                    const el = containerRef.current
                    if (!el || el.contains(document.activeElement)) return
                    el.focus({ preventScroll: true })
                }}
                className={
                    'relative flex-1 min-h-0 overflow-hidden rounded-2xl outline-none transition-[box-shadow,border-color] duration-200 border ' +
                    (focused
                        ? 'border-blue-500/60 shadow-[0_0_0_4px_rgba(59,130,246,0.16)]'
                        : 'border-white/8 hover:border-white/20')
                }
            >
                <DeckViewer
                    key={activeId}
                    deckId={activeId}
                    keyboardEnabled={focused}
                    embed
                />

                <div
                    className={
                        'pointer-events-none absolute top-3 left-3 z-40 inline-flex items-center gap-1.5 rounded-full border bg-zinc-950/70 backdrop-blur px-2.5 h-7 text-[11px] font-medium transition-opacity duration-200 ' +
                        (focused
                            ? 'border-blue-500/40 text-blue-200 opacity-100'
                            : 'border-white/15 text-white/55 opacity-90')
                    }
                >
                    {focused ? (
                        <>
                            <Keyboard className="w-3.5 h-3.5" />
                            Hotkeys live · ←/→ · V · G · F
                        </>
                    ) : (
                        <>
                            <MousePointerClick className="w-3.5 h-3.5" />
                            Click or tap to control
                        </>
                    )}
                </div>
            </div>

            {decks.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 px-1">
                    {decks.map((d) => {
                        const active = d.id === activeId
                        return (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => setActiveId(d.id)}
                                className={
                                    'inline-flex items-center gap-2 rounded-full px-3 h-8 text-xs font-semibold transition-colors ' +
                                    (active
                                        ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]'
                                        : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/10')
                                }
                            >
                                {d.title}
                                <span
                                    className={
                                        'tabular-nums text-[10px] ' +
                                        (active ? 'text-white/80' : 'text-white/30')
                                    }
                                >
                                    {d.slideCount}
                                </span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

'use client'
import { useEffect, useRef, useState } from 'react'
import { useMultiplayerIdentity, type MultiplayerIdentity } from '@/lib/multiplayer/identity'

const SLIDE_W = 1280
const SLIDE_H = 720
const SEND_HZ = 60
const SEND_INTERVAL = 1000 / SEND_HZ
const RECONNECT_BASE_MS = 500
const RECONNECT_MAX_MS = 10_000

interface PeerState {
    sid: string
    name: string
    color: string
    x: number
    y: number
    s: string
    visible: boolean
}

/**
 * Single bidirectional WebSocket per deck visit. Inbound: roster + cursor
 * ticks fan out from the broker. Outbound: pointermove-driven cursor frames
 * at up to 60Hz.
 *
 * The renderer (`PresenceLayer`) consumes the peers map and writes cursor
 * positions directly to DOM via refs — zero React re-renders per frame.
 */
export interface UsePresenceResult {
    peers: Map<string, PeerState>
    peerCount: number
    setStageEl: (el: HTMLElement | null) => void
    registerCursorEl: (sid: string, el: HTMLDivElement | null) => void
    identity: MultiplayerIdentity
    currentSlideIdRef: React.RefObject<string>
}

export function usePresence(
    deckId: string,
    enabled: boolean,
    slideId: string,
): UsePresenceResult {
    const identity = useMultiplayerIdentity(deckId)
    const [peers, setPeers] = useState<Map<string, PeerState>>(() => new Map())
    const peersRef = useRef(peers)
    useEffect(() => { peersRef.current = peers }, [peers])

    const cursorElsRef = useRef<Map<string, HTMLDivElement>>(new Map())
    const stageElRef = useRef<HTMLElement | null>(null)
    const currentSlideIdRef = useRef(slideId)
    useEffect(() => { currentSlideIdRef.current = slideId }, [slideId])

    // Single socket — held in a ref so the send loop and reconnect logic share it.
    const socketRef = useRef<WebSocket | null>(null)

    const lastSentRef = useRef<{ x: number; y: number; t: number; cleared: boolean }>({
        x: -2, y: -2, t: 0, cleared: true,
    })
    const pendingRef = useRef<{ x: number; y: number; cleared: boolean } | null>(null)

    // ── Connection (WebSocket) ─────────────────────────────────────────────
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return

        let cancelled = false
        let backoff = RECONNECT_BASE_MS
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null

        const writeCursor = (sid: string, x: number, y: number, s: string) => {
            const cleared = x === -1 && y === -1
            const el = cursorElsRef.current.get(sid)
            if (el) {
                const onSlide = !cleared && s === currentSlideIdRef.current
                el.style.transform = `translate3d(${x}px, ${y}px, 0)`
                el.style.opacity = onSlide ? '1' : '0'
            }
            const cur = peersRef.current.get(sid)
            if (cur && (cur.s !== s || cur.visible === cleared)) {
                setPeers((prev) => {
                    const next = new Map(prev)
                    const existing = next.get(sid)
                    if (!existing) return prev
                    next.set(sid, { ...existing, x, y, s, visible: !cleared })
                    return next
                })
            }
        }

        const connect = () => {
            if (cancelled) return
            const params = new URLSearchParams({
                sid: identity.sessionId,
                n: identity.animal,
                c: identity.color,
                reveal: identity.revealName ? '1' : '0',
            })
            const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const url = `${proto}//${window.location.host}/api/decks/${encodeURIComponent(deckId)}/presence/ws?${params.toString()}`

            const ws = new WebSocket(url)
            socketRef.current = ws

            ws.addEventListener('open', () => {
                backoff = RECONNECT_BASE_MS
                // Re-announce current slide so peers see us join the right room.
                const last = lastSentRef.current
                const x = last.cleared ? -1 : last.x
                const y = last.cleared ? -1 : last.y
                try {
                    ws.send(JSON.stringify({ t: 'cursor', x, y, s: currentSlideIdRef.current }))
                } catch {}
            })

            ws.addEventListener('message', (ev) => {
                let msg: { t?: string } & Record<string, unknown>
                try { msg = JSON.parse(ev.data as string) } catch { return }
                if (!msg || typeof msg.t !== 'string') return

                if (msg.t === 'hello') {
                    const m = (msg.m as Array<{ i: string; n: string; c: string; x?: number; y?: number; s?: string }>) ?? []
                    setPeers(() => {
                        const next = new Map<string, PeerState>()
                        for (const p of m) {
                            const cleared = p.x === undefined || p.x === -1
                            next.set(p.i, {
                                sid: p.i, name: p.n, color: p.c,
                                x: p.x ?? -1, y: p.y ?? -1, s: p.s ?? '',
                                visible: !cleared,
                            })
                        }
                        return next
                    })
                } else if (msg.t === 'join') {
                    const { i, n, c } = msg as { i: string; n: string; c: string }
                    setPeers((prev) => {
                        if (prev.has(i)) return prev
                        const next = new Map(prev)
                        next.set(i, { sid: i, name: n, color: c, x: -1, y: -1, s: '', visible: false })
                        return next
                    })
                } else if (msg.t === 'leave') {
                    const { i } = msg as { i: string }
                    setPeers((prev) => {
                        if (!prev.has(i)) return prev
                        const next = new Map(prev)
                        next.delete(i)
                        return next
                    })
                    cursorElsRef.current.delete(i)
                } else if (msg.t === 'tick') {
                    const u = msg.u as Array<[string, number, number, string]>
                    for (const [sid, x, y, s] of u) {
                        if (sid === identity.sessionId) continue
                        writeCursor(sid, x, y, s)
                    }
                }
            })

            const scheduleReconnect = () => {
                if (cancelled) return
                socketRef.current = null
                setPeers(() => new Map())
                if (reconnectTimer) clearTimeout(reconnectTimer)
                reconnectTimer = setTimeout(connect, backoff)
                backoff = Math.min(backoff * 2, RECONNECT_MAX_MS)
            }
            ws.addEventListener('close', scheduleReconnect)
            ws.addEventListener('error', () => {
                try { ws.close() } catch {}
            })
        }

        connect()

        return () => {
            cancelled = true
            if (reconnectTimer) clearTimeout(reconnectTimer)
            const ws = socketRef.current
            socketRef.current = null
            if (ws) {
                try { ws.close() } catch {}
            }
        }
    }, [deckId, enabled, identity.sessionId, identity.animal, identity.color, identity.revealName])

    // ── Send loop (pointermove → throttled WS send) ────────────────────────
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return
        if (matchMedia('(pointer: coarse)').matches) return

        let rect: DOMRect | null = null
        const refreshRect = () => {
            const el = stageElRef.current
            rect = el ? el.getBoundingClientRect() : null
        }
        refreshRect()
        const ro = new ResizeObserver(refreshRect)
        if (stageElRef.current) ro.observe(stageElRef.current)
        window.addEventListener('scroll', refreshRect, true)
        window.addEventListener('resize', refreshRect)

        const onMove = (e: PointerEvent) => {
            if (document.hidden) return
            if (!rect || !stageElRef.current) refreshRect()
            if (!rect) return
            const scale = rect.width / SLIDE_W
            if (scale <= 0) return
            const x = Math.round((e.clientX - rect.left) / scale)
            const y = Math.round((e.clientY - rect.top) / scale)
            if (x < 0 || x > SLIDE_W || y < 0 || y > SLIDE_H) {
                if (!lastSentRef.current.cleared) {
                    pendingRef.current = { x: -1, y: -1, cleared: true }
                }
                return
            }
            pendingRef.current = { x, y, cleared: false }
        }
        const onLeave = () => {
            if (!lastSentRef.current.cleared) {
                pendingRef.current = { x: -1, y: -1, cleared: true }
            }
        }
        const onVis = () => {
            if (document.hidden && !lastSentRef.current.cleared) {
                pendingRef.current = { x: -1, y: -1, cleared: true }
            }
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        document.addEventListener('pointerleave', onLeave)
        document.addEventListener('visibilitychange', onVis)

        let raf = 0
        const tick = () => {
            raf = requestAnimationFrame(tick)
            const now = performance.now()
            const last = lastSentRef.current
            if (now - last.t < SEND_INTERVAL) return
            const p = pendingRef.current
            if (!p) return
            const ws = socketRef.current
            if (!ws || ws.readyState !== ws.OPEN) return
            if (p.x === last.x && p.y === last.y) return
            pendingRef.current = null
            lastSentRef.current = { x: p.x, y: p.y, t: now, cleared: p.cleared }
            try {
                ws.send(JSON.stringify({ t: 'cursor', x: p.x, y: p.y, s: currentSlideIdRef.current }))
            } catch {}
        }
        raf = requestAnimationFrame(tick)

        const refreshTimer = setInterval(refreshRect, 1000)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            clearInterval(refreshTimer)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('scroll', refreshRect, true)
            window.removeEventListener('resize', refreshRect)
            document.removeEventListener('pointerleave', onLeave)
            document.removeEventListener('visibilitychange', onVis)
            // Best-effort goodbye cursor — the close itself triggers leave server-side.
            const ws = socketRef.current
            if (ws && ws.readyState === ws.OPEN) {
                try {
                    ws.send(JSON.stringify({
                        t: 'cursor', x: -1, y: -1, s: currentSlideIdRef.current,
                    }))
                } catch {}
            }
        }
    }, [enabled])

    // ── Slide-change heartbeat ─────────────────────────────────────────────
    // Re-announce slide so per-slide peer counts update without pointermove.
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return
        if (!slideId) return
        const ws = socketRef.current
        if (!ws || ws.readyState !== ws.OPEN) return
        const last = lastSentRef.current
        const x = last.cleared ? -1 : last.x
        const y = last.cleared ? -1 : last.y
        lastSentRef.current = { x, y, t: performance.now(), cleared: last.cleared }
        try {
            ws.send(JSON.stringify({ t: 'cursor', x, y, s: slideId }))
        } catch {}
    }, [enabled, slideId])

    // Hide peers on a different slide whenever the local viewer changes slides.
    useEffect(() => {
        for (const [sid, p] of peersRef.current) {
            const el = cursorElsRef.current.get(sid)
            if (!el) continue
            el.style.opacity = p.visible && p.s === slideId ? '1' : '0'
        }
    }, [slideId])

    return {
        peers,
        peerCount: peers.size,
        setStageEl: (el) => { stageElRef.current = el },
        registerCursorEl: (sid, el) => {
            if (el) cursorElsRef.current.set(sid, el)
            else cursorElsRef.current.delete(sid)
        },
        identity,
        currentSlideIdRef,
    }
}

interface PresenceLayerProps {
    presence: UsePresenceResult
    slideId: string
}

/**
 * Pure renderer. Mounted inside ScaledStage so cursor positions inherit the
 * CSS scale transform. Re-mounting per slide is fine — connection state
 * lives in the parent hook.
 */
export function PresenceLayer({ presence, slideId }: PresenceLayerProps) {
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stage = rootRef.current?.parentElement ?? null
        presence.setStageEl(stage)
        return () => presence.setStageEl(null)
    }, [presence])

    return (
        <div
            ref={rootRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ width: SLIDE_W, height: SLIDE_H }}
            aria-hidden
        >
            {Array.from(presence.peers.values()).map((p) => (
                <PeerCursor
                    key={p.sid}
                    peer={p}
                    onMount={(el) => presence.registerCursorEl(p.sid, el)}
                    visibleOnSlide={p.visible && p.s === slideId}
                />
            ))}
        </div>
    )
}

function PeerCursor({
    peer,
    onMount,
    visibleOnSlide,
}: {
    peer: PeerState
    onMount: (el: HTMLDivElement | null) => void
    visibleOnSlide: boolean
}) {
    return (
        <div
            ref={onMount}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate3d(${peer.x}px, ${peer.y}px, 0)`,
                transition: 'opacity 120ms ease',
                opacity: visibleOnSlide ? 1 : 0,
                willChange: 'transform',
            }}
        >
            <svg width="22" height="28" viewBox="0 0 22 28" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))' }}>
                <path
                    d="M2 2 L2 22 L7 18 L10 26 L13 25 L10 17 L18 17 Z"
                    fill={peer.color}
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    left: 18,
                    top: 22,
                    background: peer.color,
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                }}
            >
                {peer.name}
            </div>
        </div>
    )
}

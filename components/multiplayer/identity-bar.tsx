'use client'
import { useEffect, useState } from 'react'
import { Users, X } from 'lucide-react'
import {
    useMultiplayerIdentity,
    readCalloutSeen,
    markCalloutSeen,
} from '@/lib/multiplayer/identity'

interface IdentityBarProps {
    deckId: string
    /** Number of peers currently visible (excl. self). */
    peerCount: number
}

export function IdentityBar({ deckId, peerCount }: IdentityBarProps) {
    const identity = useMultiplayerIdentity(deckId)
    const [displayName, setDisplayName] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const [calloutOpen, setCalloutOpen] = useState(false)

    useEffect(() => {
        let cancelled = false
        fetch('/api/investors/me', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (cancelled) return
                if (data?.authenticated && typeof data.displayName === 'string') {
                    setDisplayName(data.displayName)
                }
            })
            .catch(() => {})
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (matchMedia('(pointer: coarse)').matches) return
        if (!readCalloutSeen()) {
            const t = setTimeout(() => setCalloutOpen(true), 600)
            return () => clearTimeout(t)
        }
    }, [])

    const shownName = identity.revealName && displayName ? displayName : identity.animal

    return (
        <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 select-none">
            <button
                type="button"
                onClick={() => { setOpen((v) => !v); if (calloutOpen) { setCalloutOpen(false); markCalloutSeen() } }}
                title="Multiplayer presence"
                className="flex items-center gap-2 rounded-full bg-zinc-900/80 backdrop-blur px-3 py-1.5 text-xs text-white/85 ring-1 ring-white/10 hover:bg-zinc-900 hover:text-white transition"
            >
                <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: identity.color }}
                />
                <span className="font-medium tracking-wide">{shownName}</span>
                {peerCount > 0 && (
                    <span className="flex items-center gap-1 text-white/55 border-l border-white/10 pl-2 ml-1">
                        <Users className="w-3 h-3" />
                        <span className="tabular-nums">{peerCount}</span>
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-full mb-2 left-0 w-72 rounded-lg bg-zinc-900/95 backdrop-blur ring-1 ring-white/10 p-3 text-xs text-white/85 shadow-xl">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">You appear as</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className="inline-block w-2.5 h-2.5 rounded-full"
                                    style={{ background: identity.color }}
                                />
                                <span className="text-sm font-semibold">{shownName}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-white/40 hover:text-white/80"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {displayName ? (
                        <label className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10 cursor-pointer">
                            <span className="leading-tight">
                                Show my real name<br />
                                <span className="text-white/40">{displayName}</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={identity.revealName}
                                onChange={(e) => identity.setRevealName(e.target.checked)}
                                className="h-4 w-4 accent-indigo-500"
                            />
                        </label>
                    ) : (
                        <div className="mt-3 pt-3 border-t border-white/10 text-white/45 leading-snug">
                            Anonymous mode. Sign in to reveal your name to other viewers.
                        </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-white/10 text-white/40 leading-snug">
                        {peerCount === 0
                            ? 'No one else is here right now.'
                            : peerCount === 1
                                ? '1 other viewer is here. Their cursor is shown live.'
                                : `${peerCount} other viewers are here. Their cursors are shown live.`}
                    </div>
                </div>
            )}

            {calloutOpen && !open && (
                <div className="absolute bottom-full mb-2 left-0 w-64 rounded-lg bg-indigo-600/95 ring-1 ring-indigo-400/40 p-3 text-xs text-white shadow-xl">
                    <div className="font-semibold mb-1">Live cursors are on</div>
                    <div className="text-white/85 leading-snug">
                        Other viewers can see your cursor. You appear as <b>{identity.animal}</b>.
                        {displayName ? ' Click here to reveal your name.' : ''}
                    </div>
                    <button
                        type="button"
                        onClick={() => { setCalloutOpen(false); markCalloutSeen() }}
                        className="absolute top-1.5 right-1.5 text-white/70 hover:text-white"
                        aria-label="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    )
}

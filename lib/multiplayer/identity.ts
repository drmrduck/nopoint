'use client'
import { useSyncExternalStore } from 'react'

const ANIMALS = [
    'Otter', 'Falcon', 'Heron', 'Lynx', 'Marten', 'Badger', 'Quokka', 'Tapir',
    'Ibis', 'Vole', 'Civet', 'Coati', 'Dingo', 'Eland', 'Fennec', 'Genet',
    'Hare', 'Jaguar', 'Kestrel', 'Lemur', 'Manta', 'Narwhal', 'Ocelot', 'Puffin',
    'Quoll', 'Raven', 'Saiga', 'Tanuki', 'Urial', 'Vicuna', 'Wombat', 'Yak',
    'Albatross', 'Bobcat', 'Caracal', 'Dhole', 'Echidna', 'Ferret', 'Gibbon',
    'Hyrax', 'Impala', 'Jerboa', 'Koi', 'Loris', 'Markhor', 'Numbat', 'Okapi',
    'Pangolin', 'Quetzal', 'Reindeer', 'Serval', 'Tarsier', 'Uakari', 'Viper',
    'Wallaby', 'Xerus', 'Yapok', 'Zebu', 'Aardwolf', 'Beluga', 'Cassowary',
    'Dugong', 'Egret',
] as const

// 12-hue palette: avoids red/green collisions (color-blind safe-ish).
const HUE_BUCKETS = [210, 195, 240, 270, 300, 330, 30, 45, 25, 180, 165, 285]

function fnv1a(s: string): number {
    let h = 0x811c9dc5
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 0x01000193)
    }
    return h >>> 0
}

export function deriveAnimal(sid: string): string {
    return ANIMALS[fnv1a(sid + ':n') % ANIMALS.length] ?? 'Otter'
}

export function deriveColor(sid: string): string {
    const hue = HUE_BUCKETS[fnv1a(sid + ':c') % HUE_BUCKETS.length] ?? 200
    return `hsl(${hue} 70% 58%)`
}

const SID_KEY = 'nopoint_mp_sid'
const REVEAL_KEY = (deckId: string) => `nopoint_mp_reveal:${deckId}`
const CALLOUT_KEY = 'nopoint_mp_seen'

function newSid(): string {
    if (typeof window === 'undefined') return 'ssr'
    const buf = new Uint8Array(8)
    crypto.getRandomValues(buf)
    return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

// Per-tab SID: sessionStorage is scoped to the tab, so two tabs from the same
// user become two distinct presences in the room.
function readSid(): string {
    if (typeof window === 'undefined') return 'ssr'
    try {
        const cur = sessionStorage.getItem(SID_KEY)
        if (cur) return cur
        const sid = newSid()
        sessionStorage.setItem(SID_KEY, sid)
        return sid
    } catch {
        return newSid()
    }
}

const listeners = new Set<() => void>()
function notify() { listeners.forEach((l) => l()) }
function subscribe(cb: () => void) {
    listeners.add(cb)
    return () => { listeners.delete(cb) }
}

function readReveal(deckId: string): boolean {
    if (typeof window === 'undefined') return false
    try {
        return localStorage.getItem(REVEAL_KEY(deckId)) === '1'
    } catch {
        return false
    }
}

function writeReveal(deckId: string, value: boolean) {
    try {
        if (value) localStorage.setItem(REVEAL_KEY(deckId), '1')
        else localStorage.removeItem(REVEAL_KEY(deckId))
    } catch {}
    notify()
}

export interface MultiplayerIdentity {
    sessionId: string
    animal: string
    color: string
    /** True when the viewer has opted to broadcast their displayName for THIS deck. */
    revealName: boolean
    setRevealName: (next: boolean) => void
}

export function useMultiplayerIdentity(deckId: string): MultiplayerIdentity {
    const sessionId = useSyncExternalStore(
        subscribe,
        readSid,
        () => 'ssr',
    )
    const revealName = useSyncExternalStore(
        subscribe,
        () => readReveal(deckId),
        () => false,
    )
    return {
        sessionId,
        animal: deriveAnimal(sessionId),
        color: deriveColor(sessionId),
        revealName,
        setRevealName: (next) => writeReveal(deckId, next),
    }
}

export function readCalloutSeen(): boolean {
    if (typeof window === 'undefined') return true
    try { return localStorage.getItem(CALLOUT_KEY) === '1' } catch { return true }
}

export function markCalloutSeen() {
    try { localStorage.setItem(CALLOUT_KEY, '1') } catch {}
    notify()
}

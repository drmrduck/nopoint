'use client'
import { useSyncExternalStore } from 'react'

export type ViewModePref = 'card' | 'full' | 'grid' | 'scroll' | 'mobile'

export interface Preferences {
    /** When false (default), slide transitions are disabled. */
    transitionsEnabled: boolean
    /** Initial view mode for a deck the user hasn't customised yet. */
    defaultViewMode: ViewModePref
    /** Show the small "CONFIDENTIAL — <deck>" footer watermark. */
    showConfidentialWatermark: boolean
    /** Show the giant faded slide number behind the slide. */
    showNumberWatermark: boolean
    /** Open the slide context widget automatically on each slide. */
    contextWidgetDefaultOpen: boolean
    /** Auto-hide the bottom bar / top right chrome when idle (otherwise show on hover). */
    autoHideChrome: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
    transitionsEnabled: false,
    defaultViewMode: 'card',
    showConfidentialWatermark: true,
    showNumberWatermark: true,
    contextWidgetDefaultOpen: false,
    autoHideChrome: true,
}

const KEY = 'nopoint_prefs'

let cached: Preferences | null = null
const listeners = new Set<() => void>()

function read(): Preferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES
    if (cached) return cached
    let next: Preferences = DEFAULT_PREFERENCES
    try {
        const raw = localStorage.getItem(KEY)
        if (raw) next = { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) }
    } catch {}
    cached = next
    return next
}

function write(next: Preferences) {
    cached = next
    try {
        localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
    listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
    listeners.add(cb)
    return () => {
        listeners.delete(cb)
    }
}

function getServerSnapshot(): Preferences {
    return DEFAULT_PREFERENCES
}

export function usePreferences(): readonly [Preferences, (patch: Partial<Preferences>) => void] {
    const prefs = useSyncExternalStore(subscribe, read, getServerSnapshot)
    const update = (patch: Partial<Preferences>) => {
        write({ ...read(), ...patch })
    }
    return [prefs, update] as const
}

export function readPreferencesSync(): Preferences {
    return read()
}

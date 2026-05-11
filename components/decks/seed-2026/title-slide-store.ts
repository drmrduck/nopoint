'use client'

import { useSyncExternalStore } from 'react'

export interface DotGridState {
    spacing: number
    dotRadius: number
    radius: number
    baseOpacity: number
    activeOpacity: number
    repel: number
    color: string
    accent: string
}

const DEFAULTS: DotGridState = {
    spacing: 21,
    dotRadius: 2.7,
    radius: 450,
    baseOpacity: 0.18,
    activeOpacity: 0.61,
    repel: 12.5,
    color: '#1e3a8a',
    accent: '#60a5fa',
}

let state: DotGridState = { ...DEFAULTS }
const listeners = new Set<() => void>()

function emit() {
    for (const l of listeners) l()
}

export const dotGridStore = {
    get(): DotGridState {
        return state
    },
    set(patch: Partial<DotGridState>) {
        state = { ...state, ...patch }
        emit()
    },
    reset() {
        state = { ...DEFAULTS }
        emit()
    },
    subscribe(fn: () => void) {
        listeners.add(fn)
        return () => listeners.delete(fn)
    },
    DEFAULTS,
}

export function useDotGrid(): DotGridState {
    return useSyncExternalStore(
        dotGridStore.subscribe,
        dotGridStore.get,
        dotGridStore.get,
    )
}

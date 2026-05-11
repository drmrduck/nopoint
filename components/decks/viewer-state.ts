/**
 * localStorage helpers for the deck viewer. Per-deck keys hold:
 *   - slide order + enabled set
 *   - last-used view mode
 *   - per-slide variant choices
 *
 * URL params (`?slide=`, `?view=`, `?variant=`) win on first load and the
 * viewer writes them back. Never persists the current slide index — fresh
 * visits always start at slide 1.
 */

import type { ViewMode, ViewModePref } from './viewer-types'

const VIEW_MODES: ViewMode[] = ['card', 'full', 'grid', 'scroll', 'mobile']

export interface SlideState {
    order: string[]
    enabled: Set<string>
}

export function loadSlideState(deckId: string, defaultOrder: string[]): SlideState {
    try {
        const rawOrder = localStorage.getItem(`deck_${deckId}_slide_order`)
        const rawEnabled = localStorage.getItem(`deck_${deckId}_enabled_slides`)
        const storedOrder: string[] = rawOrder ? JSON.parse(rawOrder) : defaultOrder
        const storedEnabled: string[] = rawEnabled ? JSON.parse(rawEnabled) : defaultOrder
        const merged = [
            ...storedOrder,
            ...defaultOrder.filter((id) => !storedOrder.includes(id)),
        ]
        return { order: merged, enabled: new Set(storedEnabled) }
    } catch {
        return { order: defaultOrder, enabled: new Set(defaultOrder) }
    }
}

export function saveSlideState(deckId: string, state: SlideState) {
    try {
        localStorage.setItem(`deck_${deckId}_slide_order`, JSON.stringify(state.order))
        localStorage.setItem(
            `deck_${deckId}_enabled_slides`,
            JSON.stringify([...state.enabled]),
        )
    } catch {}
}

export function loadViewMode(deckId: string, fallback: ViewModePref): ViewMode {
    try {
        const raw = localStorage.getItem(`deck_${deckId}_view_mode`)
        if (raw && (VIEW_MODES as string[]).includes(raw)) return raw as ViewMode
    } catch {}
    return fallback as ViewMode
}

export function saveViewMode(deckId: string, mode: ViewMode) {
    try {
        localStorage.setItem(`deck_${deckId}_view_mode`, mode)
    } catch {}
}

export function loadVariantChoices(deckId: string): Record<string, string> {
    try {
        const raw = localStorage.getItem(`deck_${deckId}_variant_choices`)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export function saveVariantChoices(deckId: string, choices: Record<string, string>) {
    try {
        localStorage.setItem(`deck_${deckId}_variant_choices`, JSON.stringify(choices))
    } catch {}
}

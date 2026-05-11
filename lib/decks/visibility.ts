// Decks listed here are reachable without an investor session. The Edge proxy
// imports this file directly, so it must NOT pull in React component code.
//
// Source of truth for `DeckDefinition.public` is derived from this list.
// Mark a deck public when it is safe to share with anyone who has the URL —
// gag decks, OSS templates, and "all-hands" pitch material. Decks with real
// numbers, partner-only follow-ups, or anything sensitive should stay off this
// list and remain gated behind investor credentials.
export const PUBLIC_DECK_IDS = [
    'seed-2026',
    'sequoia',
    'chartpasta',
    'rr-diner',
    'airbnb',
    'buffer',
] as const

const PUBLIC_DECK_SET = new Set<string>(PUBLIC_DECK_IDS)

export function isPublicDeck(deckId: string): boolean {
    return PUBLIC_DECK_SET.has(deckId)
}

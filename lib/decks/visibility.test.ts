import { describe, expect, test } from 'bun:test'
import { isPublicDeck, PUBLIC_DECK_IDS } from './visibility'

describe('isPublicDeck', () => {
    test('every declared public id resolves to true', () => {
        for (const id of PUBLIC_DECK_IDS) {
            expect(isPublicDeck(id)).toBe(true)
        }
    })

    test('unknown deck ids are not public', () => {
        expect(isPublicDeck('something-private')).toBe(false)
        expect(isPublicDeck('')).toBe(false)
    })

    test('match is exact, not a prefix or case-insensitive', () => {
        expect(isPublicDeck('seed-2026 ')).toBe(false)
        expect(isPublicDeck('SEED-2026')).toBe(false)
        expect(isPublicDeck('seed-2026/extra')).toBe(false)
    })
})

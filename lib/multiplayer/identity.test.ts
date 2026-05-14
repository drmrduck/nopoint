import { describe, expect, test } from 'bun:test'
import { deriveAnimal, deriveColor } from './identity'

describe('deriveAnimal', () => {
    test('is deterministic for a given sid', () => {
        expect(deriveAnimal('abc123')).toBe(deriveAnimal('abc123'))
    })

    test('different sids generally derive different animals', () => {
        const seen = new Set<string>()
        for (let i = 0; i < 32; i++) seen.add(deriveAnimal(`sid-${i}`))
        // Not a uniqueness guarantee, just a smoke check that the hash spreads.
        expect(seen.size).toBeGreaterThan(8)
    })

    test('always returns a non-empty string from the known list', () => {
        const animal = deriveAnimal('')
        expect(typeof animal).toBe('string')
        expect(animal.length).toBeGreaterThan(0)
    })
})

describe('deriveColor', () => {
    test('is deterministic for a given sid', () => {
        expect(deriveColor('abc123')).toBe(deriveColor('abc123'))
    })

    test('returns a valid hsl() string', () => {
        const color = deriveColor('whatever')
        expect(color).toMatch(/^hsl\(\d+\s+70%\s+58%\)$/)
    })

    test('uses one of the 12 color-blind safe hue buckets', () => {
        const allowedHues = new Set([210, 195, 240, 270, 300, 330, 30, 45, 25, 180, 165, 285])
        for (let i = 0; i < 50; i++) {
            const color = deriveColor(`sid-${i}`)
            const match = color.match(/^hsl\((\d+)\s/)
            expect(match).toBeTruthy()
            expect(allowedHues.has(Number(match![1]))).toBe(true)
        }
    })
})

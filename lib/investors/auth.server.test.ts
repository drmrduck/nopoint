import { describe, expect, test } from 'bun:test'
import { canAccess, checkCredentials } from './auth.server'
import { INVESTOR_CREDENTIALS, type InvestorCredential } from './credentials.server'

const demo = INVESTOR_CREDENTIALS.find((c) => c.username === 'demo@nopoint.dev')!
const partner = INVESTOR_CREDENTIALS.find((c) => c.username === 'partner@nopoint.dev')!

describe('checkCredentials', () => {
    test('accepts an exact match', () => {
        const result = checkCredentials(demo.username, demo.password)
        expect(result?.username).toBe(demo.username)
    })

    test('normalizes username case and whitespace', () => {
        const result = checkCredentials(`  ${demo.username.toUpperCase()}  `, demo.password)
        expect(result?.username).toBe(demo.username)
    })

    test('is case-sensitive on password', () => {
        const result = checkCredentials(demo.username, demo.password.toUpperCase())
        expect(result).toBeNull()
    })

    test('rejects an unknown username', () => {
        expect(checkCredentials('nobody@example.com', demo.password)).toBeNull()
    })

    test('rejects an empty password', () => {
        expect(checkCredentials(demo.username, '')).toBeNull()
    })

    test('rejects a wrong password of a different length (timing-safe path)', () => {
        // constantTimeEquals short-circuits when lengths differ — make sure that
        // still returns null rather than throwing or coercing to a match.
        expect(checkCredentials(demo.username, 'x')).toBeNull()
    })

    test('skips disabled credentials', () => {
        const disabled: InvestorCredential = {
            username: 'ghost@example.com',
            password: 'ghost-pw',
            displayName: 'Ghost',
            accessTo: '*',
            disabled: true,
            createdAt: '2026-01-01T00:00:00Z',
        }
        INVESTOR_CREDENTIALS.push(disabled)
        try {
            expect(checkCredentials('ghost@example.com', 'ghost-pw')).toBeNull()
        } finally {
            INVESTOR_CREDENTIALS.pop()
        }
    })
})

describe('canAccess', () => {
    test('wildcard credential reaches any deck', () => {
        expect(canAccess(partner, 'seed-2026')).toBe(true)
        expect(canAccess(partner, 'something-private')).toBe(true)
    })

    test('scoped credential reaches its own decks only', () => {
        expect(canAccess(demo, 'seed-2026')).toBe(true)
        expect(canAccess(demo, 'private-deck-not-in-list')).toBe(false)
    })

    test('public decks are reachable even when not in accessTo', () => {
        // `sequoia` is in PUBLIC_DECK_IDS but not in the demo investor's accessTo.
        const scoped: InvestorCredential = {
            ...demo,
            accessTo: ['some-other-deck'],
        }
        expect(canAccess(scoped, 'sequoia')).toBe(true)
    })
})

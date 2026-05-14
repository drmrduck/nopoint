import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'
import { proxy } from './proxy'
import { signSession } from '@/lib/investors/session.server'

function makeRequest(path: string, { cookie }: { cookie?: string } = {}) {
    return new NextRequest(`http://localhost${path}`, {
        method: 'GET',
        headers: cookie ? { cookie: `investor_session=${cookie}` } : {},
    })
}

function isRedirectTo(res: Response, expectedPath: string): boolean {
    if (res.status < 300 || res.status >= 400) return false
    const loc = res.headers.get('location')
    if (!loc) return false
    return new URL(loc).pathname === expectedPath
}

describe('proxy (auth gate)', () => {
    test('redirects unauthenticated /investors/portal to /investors/login with a next param', () => {
        const res = proxy(makeRequest('/investors/portal'))
        expect(isRedirectTo(res, '/investors/login')).toBe(true)
        const loc = new URL(res.headers.get('location')!)
        expect(loc.searchParams.get('next')).toBe('/investors/portal')
    })

    test('lets a valid session through /investors/portal', () => {
        const { token } = signSession('demo@nopoint.dev')
        const res = proxy(makeRequest('/investors/portal', { cookie: token }))
        // NextResponse.next() returns a 200 with the special x-middleware-next header.
        expect(res.status).toBe(200)
        expect(res.headers.get('x-middleware-next')).toBe('1')
    })

    test('rejects a tampered cookie even on a gated path', () => {
        const res = proxy(makeRequest('/investors/portal', { cookie: 'forged.signature' }))
        expect(isRedirectTo(res, '/investors/login')).toBe(true)
    })

    test('public deck path bypasses the gate without a cookie', () => {
        const res = proxy(makeRequest('/investors/decks/seed-2026'))
        expect(res.headers.get('x-middleware-next')).toBe('1')
    })

    test('private (unknown) deck path still requires a session', () => {
        const res = proxy(makeRequest('/investors/decks/private-deck-xyz'))
        expect(isRedirectTo(res, '/investors/login')).toBe(true)
    })

    test('opengraph-image route bypasses the gate even on a non-public deck', () => {
        const res = proxy(makeRequest('/investors/decks/private-deck-xyz/opengraph-image'))
        expect(res.headers.get('x-middleware-next')).toBe('1')
    })

    test('twitter-image route bypasses the gate', () => {
        const res = proxy(makeRequest('/investors/decks/private-deck-xyz/twitter-image'))
        expect(res.headers.get('x-middleware-next')).toBe('1')
    })

    test('storytelling path requires a valid session', () => {
        const res = proxy(makeRequest('/investors/storytelling/anything'))
        expect(isRedirectTo(res, '/investors/login')).toBe(true)
    })
})

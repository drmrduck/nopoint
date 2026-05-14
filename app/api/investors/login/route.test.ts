import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { verifySession } from '@/lib/investors/session.server'

// Each test uses a unique IP so the module-scoped rate limiter in route.ts
// does not bleed between cases.
let ipCounter = 0
const freshIp = () => `10.0.0.${++ipCounter}`

function makeRequest(body: unknown, ip = freshIp(), { rawBody }: { rawBody?: string } = {}) {
    return new NextRequest('http://localhost/api/investors/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-forwarded-for': ip,
        },
        body: rawBody ?? JSON.stringify(body),
    })
}

describe('POST /api/investors/login', () => {
    test('200 with valid credentials sets a signed httpOnly cookie', async () => {
        const res = await POST(
            makeRequest({ username: 'demo@nopoint.dev', password: 'demo-2026-public' }),
        )
        expect(res.status).toBe(200)
        const json = (await res.json()) as { success: boolean; displayName: string }
        expect(json.success).toBe(true)
        expect(json.displayName).toBe('Demo Investor')

        const cookie = res.cookies.get('investor_session')
        expect(cookie?.value).toBeTruthy()
        expect(cookie?.httpOnly).toBe(true)
        expect(cookie?.sameSite).toBe('lax')
        expect(cookie?.path).toBe('/')
        expect(cookie?.maxAge).toBe(60 * 60)

        const verified = verifySession(cookie!.value)
        expect(verified.valid).toBe(true)
        if (verified.valid) expect(verified.username).toBe('demo@nopoint.dev')
    })

    test('401 on wrong password — does not set a cookie', async () => {
        const res = await POST(
            makeRequest({ username: 'demo@nopoint.dev', password: 'wrong' }),
        )
        expect(res.status).toBe(401)
        expect(res.cookies.get('investor_session')).toBeUndefined()
    })

    test('401 on unknown username', async () => {
        const res = await POST(
            makeRequest({ username: 'nobody@example.com', password: 'demo-2026-public' }),
        )
        expect(res.status).toBe(401)
    })

    test('400 when the body is missing fields', async () => {
        const res = await POST(makeRequest({ username: 'demo@nopoint.dev' }))
        expect(res.status).toBe(400)
    })

    test('400 when the body is not valid JSON', async () => {
        const res = await POST(makeRequest(null, undefined, { rawBody: 'not-json' }))
        expect(res.status).toBe(400)
    })

    test('429 after exceeding the rate limit window for one IP', async () => {
        const ip = freshIp()
        // 8 allowed attempts per minute per IP; 9th must be blocked.
        const bad = { username: 'demo@nopoint.dev', password: 'wrong' }
        for (let i = 0; i < 8; i++) {
            const res = await POST(makeRequest(bad, ip))
            expect([400, 401]).toContain(res.status)
        }
        const blocked = await POST(makeRequest(bad, ip))
        expect(blocked.status).toBe(429)
    })

    test('rate limit is per-IP — a different IP is not blocked', async () => {
        const noisyIp = freshIp()
        const quietIp = freshIp()
        const bad = { username: 'demo@nopoint.dev', password: 'wrong' }
        for (let i = 0; i < 9; i++) await POST(makeRequest(bad, noisyIp))

        const res = await POST(
            makeRequest({ username: 'demo@nopoint.dev', password: 'demo-2026-public' }, quietIp),
        )
        expect(res.status).toBe(200)
    })

    test('username is case-insensitive on the login surface', async () => {
        const res = await POST(
            makeRequest({ username: 'DEMO@NoPoint.DEV', password: 'demo-2026-public' }),
        )
        expect(res.status).toBe(200)
    })
})

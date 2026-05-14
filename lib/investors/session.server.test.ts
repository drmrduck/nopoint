import { describe, expect, test } from 'bun:test'
import crypto from 'crypto'
import { signSession, verifySession } from './session.server'
import { INVESTOR_SESSION_SECRET } from './credentials.server'

describe('signSession + verifySession', () => {
    test('round-trips a freshly signed token', () => {
        const { token } = signSession('demo@nopoint.dev')
        const result = verifySession(token)
        expect(result.valid).toBe(true)
        if (result.valid) {
            expect(result.username).toBe('demo@nopoint.dev')
            expect(result.expiresAt).toBeGreaterThan(Date.now())
        }
    })

    test('lowercases the username inside the payload', () => {
        const { token } = signSession('Demo@NoPoint.dev')
        const result = verifySession(token)
        expect(result.valid).toBe(true)
        if (result.valid) expect(result.username).toBe('demo@nopoint.dev')
    })

    test('rejects an undefined token', () => {
        expect(verifySession(undefined).valid).toBe(false)
    })

    test('rejects an empty string', () => {
        expect(verifySession('').valid).toBe(false)
    })

    test('rejects a token missing the signature segment', () => {
        const payload = Buffer.from(JSON.stringify({ u: 'x', exp: Date.now() + 1000 })).toString(
            'base64url',
        )
        expect(verifySession(payload).valid).toBe(false)
        expect(verifySession(`${payload}.`).valid).toBe(false)
    })

    test('rejects a token whose signature was forged with a different secret', () => {
        const payload: { u: string; exp: number } = {
            u: 'attacker',
            exp: Date.now() + 60_000,
        }
        const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
        const forged = crypto
            .createHmac('sha256', 'not-the-real-secret')
            .update(payloadB64)
            .digest('base64url')
        expect(verifySession(`${payloadB64}.${forged}`).valid).toBe(false)
    })

    test('rejects a token whose payload was tampered with after signing', () => {
        const { token } = signSession('demo@nopoint.dev')
        const [, sig] = token.split('.')
        const swapped = Buffer.from(
            JSON.stringify({ u: 'admin', exp: Date.now() + 60_000 }),
        ).toString('base64url')
        // Reuse the original signature with a different payload — signature mismatch.
        expect(verifySession(`${swapped}.${sig}`).valid).toBe(false)
    })

    test('rejects an expired token even when the signature is valid', () => {
        const payload = { u: 'demo@nopoint.dev', exp: Date.now() - 1000 }
        const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
        const sig = crypto
            .createHmac('sha256', INVESTOR_SESSION_SECRET)
            .update(payloadB64)
            .digest('base64url')
        expect(verifySession(`${payloadB64}.${sig}`).valid).toBe(false)
    })

    test('rejects a token whose payload is not valid JSON', () => {
        const payloadB64 = Buffer.from('not-json').toString('base64url')
        const sig = crypto
            .createHmac('sha256', INVESTOR_SESSION_SECRET)
            .update(payloadB64)
            .digest('base64url')
        expect(verifySession(`${payloadB64}.${sig}`).valid).toBe(false)
    })

    test('rejects a payload missing the username field', () => {
        const payloadB64 = Buffer.from(JSON.stringify({ exp: Date.now() + 60_000 })).toString(
            'base64url',
        )
        const sig = crypto
            .createHmac('sha256', INVESTOR_SESSION_SECRET)
            .update(payloadB64)
            .digest('base64url')
        expect(verifySession(`${payloadB64}.${sig}`).valid).toBe(false)
    })
})

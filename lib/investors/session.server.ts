import crypto from 'crypto'
import { INVESTOR_SESSION_SECRET } from './credentials.server'

const SESSION_DURATION_MS = 60 * 60 * 1000

interface SessionPayload {
    u: string
    exp: number
}

export function signSession(username: string): { token: string; expiresAt: number } {
    const expiresAt = Date.now() + SESSION_DURATION_MS
    const payload: SessionPayload = { u: username.toLowerCase(), exp: expiresAt }
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = crypto
        .createHmac('sha256', INVESTOR_SESSION_SECRET)
        .update(payloadB64)
        .digest('base64url')
    return { token: `${payloadB64}.${signature}`, expiresAt }
}

export function verifySession(
    token: string | undefined,
): { valid: true; username: string; expiresAt: number } | { valid: false } {
    if (!token) return { valid: false }
    const [payloadB64, providedSig] = token.split('.')
    if (!payloadB64 || !providedSig) return { valid: false }

    const expectedSig = crypto
        .createHmac('sha256', INVESTOR_SESSION_SECRET)
        .update(payloadB64)
        .digest('base64url')

    const a = Buffer.from(providedSig)
    const b = Buffer.from(expectedSig)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return { valid: false }
    }

    try {
        const payload = JSON.parse(
            Buffer.from(payloadB64, 'base64url').toString(),
        ) as SessionPayload
        if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
            return { valid: false }
        }
        if (typeof payload.u !== 'string' || !payload.u) {
            return { valid: false }
        }
        return { valid: true, username: payload.u, expiresAt: payload.exp }
    } catch {
        return { valid: false }
    }
}

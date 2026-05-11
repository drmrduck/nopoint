import { NextRequest, NextResponse } from 'next/server'
import { checkCredentials } from '@/lib/investors/auth.server'
import { signSession } from '@/lib/investors/session.server'

const LOGIN_RATE_LIMIT = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX_ATTEMPTS = 8

function rateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = LOGIN_RATE_LIMIT.get(ip)
    if (!entry || entry.resetAt < now) {
        LOGIN_RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > RATE_MAX_ATTEMPTS
}

export async function POST(req: NextRequest) {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

    if (rateLimited(ip)) {
        return NextResponse.json(
            { error: 'Too many attempts. Try again in a minute.' },
            { status: 429 },
        )
    }

    let body: { username?: string; password?: string }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { username, password } = body
    if (!username || !password) {
        return NextResponse.json(
            { error: 'Username and password required' },
            { status: 400 },
        )
    }

    const cred = checkCredentials(username, password)
    if (!cred) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const { token, expiresAt } = signSession(cred.username)

    const res = NextResponse.json({
        success: true,
        displayName: cred.displayName,
        expiresAt,
    })

    res.cookies.set('investor_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
    })

    console.log(`[investors] Login: ${cred.username} from ${ip}`)
    return res
}

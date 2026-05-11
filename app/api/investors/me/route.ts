import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/investors/session.server'
import { INVESTOR_CREDENTIALS } from '@/lib/investors/credentials.server'

export async function GET() {
    const token = (await cookies()).get('investor_session')?.value
    const result = verifySession(token)
    if (!result.valid) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const cred = INVESTOR_CREDENTIALS.find(
        (c) => c.username.toLowerCase() === result.username && !c.disabled,
    )
    if (!cred) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
        authenticated: true,
        displayName: cred.displayName,
        accessTo: cred.accessTo,
        expiresAt: result.expiresAt,
    })
}

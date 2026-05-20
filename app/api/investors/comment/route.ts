import { NextRequest, NextResponse } from 'next/server'
import { requireInvestor } from '@/lib/investors/guard.server'
import { getPostHogClient } from '@/lib/posthog-server'

const SLACK_WEBHOOK = process.env.INVESTOR_COMMENTS_SLACK_WEBHOOK

const COMMENT_MAX_LENGTH = 4000
const COMMENT_RATE_WINDOW_MS = 60_000
const COMMENT_RATE_MAX = 10
const commentRate = new Map<string, { count: number; resetAt: number }>()

function commentRateLimited(key: string): boolean {
    const now = Date.now()
    const entry = commentRate.get(key)
    if (!entry || entry.resetAt < now) {
        commentRate.set(key, { count: 1, resetAt: now + COMMENT_RATE_WINDOW_MS })
        return false
    }
    entry.count++
    return entry.count > COMMENT_RATE_MAX
}

export async function POST(req: NextRequest) {
    const cred = await requireInvestor()
    if (!cred) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (commentRateLimited(cred.username.toLowerCase())) {
        return NextResponse.json(
            { error: 'Too many comments. Try again in a minute.' },
            { status: 429 },
        )
    }

    let body: { slideNumber?: unknown; slideTitle?: unknown; comment?: unknown; deckId?: unknown }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { slideNumber, slideTitle, comment, deckId } = body
    if (typeof comment !== 'string' || !comment.trim()) {
        return NextResponse.json({ error: 'Comment required' }, { status: 400 })
    }
    if (comment.length > COMMENT_MAX_LENGTH) {
        return NextResponse.json({ error: 'Comment too long' }, { status: 413 })
    }

    if (SLACK_WEBHOOK) {
        const response = await fetch(SLACK_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text:
                    `📊 Investor question — deck *${deckId}* slide ${slideNumber} (${slideTitle})\n` +
                    `From *${cred.displayName}* (${cred.username})\n\n` +
                    `> ${comment.replace(/\n/g, '\n> ')}`,
            }),
        }).catch(() => null)

        if (!response?.ok) {
            return NextResponse.json({ error: 'Comment delivery failed' }, { status: 502 })
        }
    } else {
        console.log('[investors/comment]', {
            from: cred.username,
            displayName: cred.displayName,
            deckId,
            slideNumber,
            slideTitle,
            comment,
        })
    }

    getPostHogClient()?.capture({
        distinctId: cred.username,
        event: 'investor_comment_submitted',
        properties: {
            deck_id: deckId,
            slide_number: slideNumber,
            slide_title: slideTitle,
            username: cred.username,
        },
    })

    return NextResponse.json({ success: true })
}

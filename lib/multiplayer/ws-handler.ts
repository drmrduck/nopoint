import type { IncomingMessage } from 'node:http'
import type { Duplex } from 'node:stream'
import { WebSocket, WebSocketServer } from 'ws'
import { verifySession } from '@/lib/investors/session.server'
import { INVESTOR_CREDENTIALS } from '@/lib/investors/credentials.server'
import { isPublicDeck } from '@/lib/decks/visibility'
import { getBroker, type Connection, type MemberProfile } from './broker'

const SLIDE_W = 1280
const SLIDE_H = 720
const PATH_PREFIX = '/api/decks/'
const PATH_SUFFIX = '/presence/ws'

export const MULTIPLAYER_OFF = process.env.NEXT_PUBLIC_MULTIPLAYER_ENABLED === 'false'

export function parseDeckIdFromPath(pathname: string): string | null {
    if (!pathname.startsWith(PATH_PREFIX) || !pathname.endsWith(PATH_SUFFIX)) return null
    const middle = pathname.slice(PATH_PREFIX.length, -PATH_SUFFIX.length)
    if (!middle || middle.includes('/')) return null
    try {
        return decodeURIComponent(middle)
    } catch {
        return null
    }
}

function readCookie(header: string | undefined, name: string): string | undefined {
    if (!header) return undefined
    for (const part of header.split(';')) {
        const idx = part.indexOf('=')
        if (idx < 0) continue
        const k = part.slice(0, idx).trim()
        if (k !== name) continue
        return decodeURIComponent(part.slice(idx + 1).trim())
    }
    return undefined
}

interface AuthResult {
    ok: boolean
    displayName: string | null
    isPublic: boolean
}

function authorize(deckId: string, cookieHeader: string | undefined): AuthResult {
    const token = readCookie(cookieHeader, 'investor_session')
    const session = verifySession(token)
    const cred = session.valid
        ? INVESTOR_CREDENTIALS.find(
            (c) => c.username.toLowerCase() === session.username && !c.disabled,
        ) ?? null
        : null

    if (isPublicDeck(deckId)) {
        return { ok: true, displayName: cred?.displayName ?? null, isPublic: true }
    }
    if (!cred) return { ok: false, displayName: null, isPublic: false }
    if (cred.accessTo !== '*' && !cred.accessTo.includes(deckId)) {
        return { ok: false, displayName: null, isPublic: false }
    }
    return { ok: true, displayName: cred.displayName, isPublic: false }
}

function clampName(s: string | null | undefined, fallback: string): string {
    if (!s) return fallback
    // Strip whitespace and dashes only — earlier `[ -]` was a character range
    // matching ASCII 0x20–0x2D, which silently chewed up `!"#$%&'()*+,-.` too.
    const trimmed = s.slice(0, 32).replace(/[\s\-]/g, '')
    return trimmed || fallback
}

function clampColor(s: string | null | undefined): string {
    if (!s) return 'hsl(210 70% 58%)'
    return /^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/.test(s) ? s : 'hsl(210 70% 58%)'
}

interface ClientMessage {
    t?: unknown
    x?: unknown
    y?: unknown
    s?: unknown
}

/**
 * Build a WebSocketServer in `noServer` mode — the custom server in
 * `server.ts` decides which upgrades reach us based on path.
 */
export function createPresenceWss(): WebSocketServer {
    const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false })

    wss.on('connection', (socket: WebSocket, req: IncomingMessage, ctx: {
        deckId: string
        sid: string
        profile: MemberProfile
    }) => {
        const { deckId, sid, profile } = ctx
        const broker = getBroker()

        const connection: Connection = {
            send(payload) {
                if (socket.readyState === socket.OPEN) socket.send(payload)
            },
            close() {
                try { socket.close() } catch {}
            },
        }

        broker.subscribe(deckId, sid, profile, connection)

        // Heartbeat — terminate dead sockets every 30s.
        let isAlive = true
        socket.on('pong', () => { isAlive = true })
        const heartbeat = setInterval(() => {
            if (!isAlive) {
                try { socket.terminate() } catch {}
                return
            }
            isAlive = false
            try { socket.ping() } catch {}
        }, 30_000)
        heartbeat.unref?.()

        socket.on('message', (raw) => {
            let body: ClientMessage
            try {
                body = JSON.parse(raw.toString()) as ClientMessage
            } catch { return }
            if (!body || typeof body !== 'object') return
            if (body.t !== 'cursor') return

            const { x, y, s } = body
            if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y)) return
            const cleared = x === -1 && y === -1
            if (!cleared && (x < 0 || x > SLIDE_W || y < 0 || y > SLIDE_H)) return
            if (typeof s !== 'string' || !s || s.length > 64) return

            broker.updateCursor(deckId, sid, Math.round(x), Math.round(y), s)
        })

        const cleanup = () => {
            clearInterval(heartbeat)
            broker.unsubscribe(deckId, sid)
        }
        socket.on('close', cleanup)
        socket.on('error', cleanup)

        // Suppress noisy client-disconnect logs.
        socket.on('error', () => {})
    })

    return wss
}

/**
 * Handle an HTTP upgrade request. Returns true if the upgrade was claimed
 * (accepted or rejected); false if the path is not ours.
 */
export function handlePresenceUpgrade(
    wss: WebSocketServer,
    req: IncomingMessage,
    rawSocket: Duplex,
    head: Buffer,
): boolean {
    if (MULTIPLAYER_OFF) return false

    const url = new URL(req.url ?? '/', 'http://localhost')
    const deckId = parseDeckIdFromPath(url.pathname)
    if (!deckId) return false

    const reject = (status: number) => {
        const reason = status === 401 ? 'Unauthorized' : status === 400 ? 'Bad Request' : 'Forbidden'
        rawSocket.write(`HTTP/1.1 ${status} ${reason}\r\n\r\n`)
        rawSocket.destroy()
    }

    const auth = authorize(deckId, req.headers.cookie)
    if (!auth.ok) { reject(401); return true }

    const sid = url.searchParams.get('sid')
    if (!sid || sid.length > 32 || !/^[a-f0-9]+$/.test(sid)) { reject(400); return true }

    const animal = clampName(url.searchParams.get('n'), 'Otter')
    const color = clampColor(url.searchParams.get('c'))
    const reveal = url.searchParams.get('reveal') === '1'

    const profile: MemberProfile = reveal && auth.displayName
        ? { name: clampName(auth.displayName, animal), color, revealed: true }
        : { name: animal, color, revealed: false }

    wss.handleUpgrade(req, rawSocket, head, (socket) => {
        wss.emit('connection', socket, req, { deckId, sid, profile })
    })
    return true
}

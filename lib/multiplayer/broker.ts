/**
 * In-memory presence broker. Module-scoped state survives across invocations
 * within a warm Node process. Pairs with a persistent transport (WebSocket
 * via the custom server in `server.ts`) — one warm Node process holds every
 * room, every member, every cursor.
 *
 * The exported `Broker` interface is the swap point — a fork can plug in
 * their own pub/sub (Redis, NATS, etc.) without touching the WS handler or
 * the client.
 */

const TICK_MS = 20          // fan-out cadence (50 Hz)
const IDLE_MS = 30_000      // drop a member after this long without any update
const ROOM_CAP = 50         // max members per deck — drops oldest on overflow

export interface MemberProfile {
    name: string
    color: string
    /** True if `name` is the investor's real displayName (opt-in reveal). */
    revealed: boolean
}

interface Cursor {
    x: number
    y: number
    s: string  // slideId
}

/**
 * Transport-agnostic connection sink. The WS handler implements this with a
 * `ws.WebSocket`; tests can implement it with an array.
 */
export interface Connection {
    send(payload: string): void
    close(): void
}

interface Member extends MemberProfile {
    sid: string
    cursor: Cursor | null
    lastSeen: number
    connection: Connection | null
}

interface Room {
    members: Map<string, Member>
    dirty: Set<string>
    tick: ReturnType<typeof setInterval> | null
}

function memberToWire(m: Member) {
    return {
        i: m.sid,
        n: m.name,
        c: m.color,
        ...(m.cursor ? { x: m.cursor.x, y: m.cursor.y, s: m.cursor.s } : {}),
    }
}

export interface Broker {
    subscribe(
        deckId: string,
        sid: string,
        profile: MemberProfile,
        connection: Connection,
    ): void
    unsubscribe(deckId: string, sid: string): void
    updateCursor(deckId: string, sid: string, x: number, y: number, slideId: string): void
}

class InMemoryBroker implements Broker {
    private rooms = new Map<string, Room>()

    private getRoom(deckId: string): Room {
        let room = this.rooms.get(deckId)
        if (!room) {
            room = { members: new Map(), dirty: new Set(), tick: null }
            this.rooms.set(deckId, room)
        }
        return room
    }

    subscribe(
        deckId: string,
        sid: string,
        profile: MemberProfile,
        connection: Connection,
    ): void {
        const room = this.getRoom(deckId)

        // Replace if same sid is already present (e.g. reconnect after toggle).
        const existing = room.members.get(sid)
        if (existing) {
            try { existing.connection?.close() } catch {}
        }

        // Cap room — drop oldest by lastSeen if at capacity.
        if (!existing && room.members.size >= ROOM_CAP) {
            let oldestSid: string | null = null
            let oldestT = Infinity
            for (const [k, m] of room.members) {
                if (m.lastSeen < oldestT) { oldestT = m.lastSeen; oldestSid = k }
            }
            if (oldestSid) this.unsubscribe(deckId, oldestSid)
        }

        const member: Member = {
            sid,
            name: profile.name,
            color: profile.color,
            revealed: profile.revealed,
            cursor: existing?.cursor ?? null,
            lastSeen: Date.now(),
            connection,
        }
        room.members.set(sid, member)

        // Send initial roster to the new subscriber.
        const roster = Array.from(room.members.values())
            .filter((m) => m.sid !== sid)
            .map(memberToWire)
        try {
            connection.send(JSON.stringify({ t: 'hello', m: roster }))
        } catch {}

        // Notify peers of join (no cursor yet).
        this.broadcast(
            deckId,
            JSON.stringify({ t: 'join', i: sid, n: member.name, c: member.color }),
            sid,
        )

        this.ensureTick(deckId)
    }

    unsubscribe(deckId: string, sid: string): void {
        const room = this.rooms.get(deckId)
        if (!room) return
        const member = room.members.get(sid)
        if (!member) return
        try { member.connection?.close() } catch {}
        room.members.delete(sid)
        room.dirty.delete(sid)
        this.broadcast(deckId, JSON.stringify({ t: 'leave', i: sid }))

        if (room.members.size === 0) {
            if (room.tick) clearInterval(room.tick)
            this.rooms.delete(deckId)
        }
    }

    updateCursor(deckId: string, sid: string, x: number, y: number, slideId: string): void {
        const room = this.rooms.get(deckId)
        if (!room) return
        const member = room.members.get(sid)
        if (!member) return
        member.lastSeen = Date.now()
        member.cursor = { x, y, s: slideId }
        room.dirty.add(sid)
    }

    private broadcast(deckId: string, payload: string, exceptSid?: string): void {
        const room = this.rooms.get(deckId)
        if (!room) return
        for (const m of room.members.values()) {
            if (m.sid === exceptSid) continue
            const c = m.connection
            if (!c) continue
            try { c.send(payload) } catch {
                // Socket closed under us — schedule unsubscribe.
                queueMicrotask(() => this.unsubscribe(deckId, m.sid))
            }
        }
    }

    private ensureTick(deckId: string): void {
        const room = this.rooms.get(deckId)
        if (!room || room.tick) return
        room.tick = setInterval(() => this.flush(deckId), TICK_MS)
        // Don't keep the process alive in environments where this matters.
        room.tick.unref?.()
    }

    private flush(deckId: string): void {
        const room = this.rooms.get(deckId)
        if (!room) return

        // GC idle members.
        const now = Date.now()
        for (const [sid, m] of room.members) {
            if (now - m.lastSeen > IDLE_MS) this.unsubscribe(deckId, sid)
        }

        // Re-fetch — unsubscribe above may have deleted the room.
        const r2 = this.rooms.get(deckId)
        if (!r2) return

        if (r2.dirty.size === 0) return

        const updates: Array<[string, number, number, string]> = []
        for (const sid of r2.dirty) {
            const m = r2.members.get(sid)
            if (m?.cursor) updates.push([sid, m.cursor.x, m.cursor.y, m.cursor.s])
        }
        r2.dirty.clear()

        if (updates.length === 0) return

        // Recipients self-filter on `i === own sid` — cheaper than per-recipient slices.
        const payload = JSON.stringify({ t: 'tick', u: updates })
        this.broadcast(deckId, payload)
    }
}

let singleton: Broker | null = null

export function getBroker(): Broker {
    if (!singleton) singleton = new InMemoryBroker()
    return singleton
}

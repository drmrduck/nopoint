import { afterEach, describe, expect, test } from 'bun:test'
import type { Connection } from './broker'
import { getBroker } from './broker'

interface FakeConnection extends Connection {
    sent: string[]
    closed: boolean
}

function fakeConn(): FakeConnection {
    const sent: string[] = []
    return {
        sent,
        closed: false,
        send(payload: string) {
            sent.push(payload)
        },
        close() {
            this.closed = true
        },
    }
}

const profile = (name: string) => ({ name, color: 'hsl(210 70% 58%)', revealed: false })

// Each test uses a unique deck id so the singleton broker's room state is
// fully isolated (and the room's tick interval is cleared when the last
// member unsubscribes).
let deckCounter = 0
const freshDeck = () => `deck-${++deckCounter}`
const activeRooms = new Set<{ deckId: string; sids: string[] }>()

afterEach(() => {
    // Drain any rooms a test left behind so setInterval handles are cleared.
    const broker = getBroker()
    for (const room of activeRooms) {
        for (const sid of room.sids) broker.unsubscribe(room.deckId, sid)
    }
    activeRooms.clear()
})

function track(deckId: string, sid: string) {
    activeRooms.add({ deckId, sids: [sid] })
}

describe('InMemoryBroker', () => {
    test('new subscriber receives a hello with the current roster', () => {
        const deckId = freshDeck()
        const broker = getBroker()
        const aConn = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), aConn)
        track(deckId, 'a')

        const bConn = fakeConn()
        broker.subscribe(deckId, 'b', profile('Bob'), bConn)
        track(deckId, 'b')

        const hello = bConn.sent.find((s) => s.includes('"t":"hello"'))
        expect(hello).toBeTruthy()
        const parsed = JSON.parse(hello!)
        expect(parsed.m).toHaveLength(1)
        expect(parsed.m[0].i).toBe('a')
        expect(parsed.m[0].n).toBe('Alice')
    })

    test('peers receive a join broadcast but the joiner does not', () => {
        const deckId = freshDeck()
        const broker = getBroker()
        const aConn = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), aConn)
        track(deckId, 'a')
        aConn.sent.length = 0 // clear; only care about messages after b joins

        const bConn = fakeConn()
        broker.subscribe(deckId, 'b', profile('Bob'), bConn)
        track(deckId, 'b')

        expect(aConn.sent.some((s) => s.includes('"t":"join"') && s.includes('"i":"b"'))).toBe(true)
        expect(bConn.sent.some((s) => s.includes('"t":"join"') && s.includes('"i":"b"'))).toBe(false)
    })

    test('reconnecting with the same sid closes the previous connection', () => {
        const deckId = freshDeck()
        const broker = getBroker()
        const first = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), first)
        const second = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), second)
        track(deckId, 'a')

        expect(first.closed).toBe(true)
        expect(second.closed).toBe(false)
    })

    test('unsubscribe broadcasts a leave to remaining peers', () => {
        const deckId = freshDeck()
        const broker = getBroker()
        const aConn = fakeConn()
        const bConn = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), aConn)
        broker.subscribe(deckId, 'b', profile('Bob'), bConn)
        track(deckId, 'a')
        track(deckId, 'b')

        aConn.sent.length = 0
        broker.unsubscribe(deckId, 'b')

        expect(aConn.sent.some((s) => s.includes('"t":"leave"') && s.includes('"i":"b"'))).toBe(true)
    })

    test('updateCursor on an unsubscribed deck/sid is a no-op (no throw)', () => {
        const broker = getBroker()
        expect(() => broker.updateCursor('ghost-deck', 'ghost', 1, 1, 's1')).not.toThrow()
    })

    test('cursor updates fan out to peers via the tick loop', async () => {
        const deckId = freshDeck()
        const broker = getBroker()
        const aConn = fakeConn()
        const bConn = fakeConn()
        broker.subscribe(deckId, 'a', profile('Alice'), aConn)
        broker.subscribe(deckId, 'b', profile('Bob'), bConn)
        track(deckId, 'a')
        track(deckId, 'b')

        aConn.sent.length = 0
        bConn.sent.length = 0

        broker.updateCursor(deckId, 'a', 100, 200, 'slide-1')

        // Tick is 20ms; give it room to flush.
        await new Promise((r) => setTimeout(r, 60))

        const tick = bConn.sent.find((s) => s.includes('"t":"tick"'))
        expect(tick).toBeTruthy()
        const parsed = JSON.parse(tick!)
        expect(parsed.u).toEqual([['a', 100, 200, 'slide-1']])
    })
})

import { describe, expect, test } from 'bun:test'
import { POST } from './route'

describe('POST /api/investors/logout', () => {
    test('returns success and clears the investor_session cookie', async () => {
        const res = await POST()
        expect(res.status).toBe(200)
        const json = (await res.json()) as { success: boolean }
        expect(json.success).toBe(true)

        const cookie = res.cookies.get('investor_session')
        expect(cookie).toBeDefined()
        expect(cookie?.value).toBe('')
        expect(cookie?.maxAge).toBe(0)
        expect(cookie?.httpOnly).toBe(true)
        expect(cookie?.sameSite).toBe('lax')
        expect(cookie?.path).toBe('/')
    })
})

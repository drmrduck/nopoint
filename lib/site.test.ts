import { describe, expect, test } from 'bun:test'
import { SITE_HOST, SITE_URL } from './site'

describe('SITE_URL / SITE_HOST', () => {
    test('SITE_URL is an absolute https URL with no trailing slash', () => {
        expect(SITE_URL).toMatch(/^https?:\/\/[^/]+$/)
    })

    test('SITE_HOST matches the URL host', () => {
        expect(SITE_HOST).toBe(new URL(SITE_URL).host)
    })

    test('SITE_URL parses without throwing', () => {
        expect(() => new URL(SITE_URL)).not.toThrow()
    })
})

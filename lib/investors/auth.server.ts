import crypto from 'crypto'
import { INVESTOR_CREDENTIALS, type InvestorCredential } from './credentials.server'
import { isPublicDeck } from '@/lib/decks/visibility'

function constantTimeEquals(a: string, b: string): boolean {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
}

export function checkCredentials(
    username: string,
    password: string,
): InvestorCredential | null {
    const normalizedUser = username.trim().toLowerCase()
    let matched: InvestorCredential | null = null

    for (const cred of INVESTOR_CREDENTIALS) {
        if (cred.disabled) continue
        const userMatches = constantTimeEquals(cred.username.toLowerCase(), normalizedUser)
        const passMatches = constantTimeEquals(cred.password, password)
        if (userMatches && passMatches) matched = cred
    }
    return matched
}

export function canAccess(cred: InvestorCredential, deckOrAreaId: string): boolean {
    // Public decks are visible to anyone — including signed-in users whose
    // explicit accessTo list doesn't include them. Without this short-circuit,
    // a credentialed investor would see *fewer* decks than a signed-out
    // visitor on /investors, which is wrong.
    if (isPublicDeck(deckOrAreaId)) return true
    if (cred.accessTo === '*') return true
    return cred.accessTo.includes(deckOrAreaId)
}

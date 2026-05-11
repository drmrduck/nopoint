import { cookies } from 'next/headers'
import { verifySession } from './session.server'
import { INVESTOR_CREDENTIALS, type InvestorCredential } from './credentials.server'

export async function requireInvestor(): Promise<InvestorCredential | null> {
    const token = (await cookies()).get('investor_session')?.value
    const result = verifySession(token)
    if (!result.valid) return null
    const cred = INVESTOR_CREDENTIALS.find(
        (c) => c.username.toLowerCase() === result.username && !c.disabled,
    )
    return cred ?? null
}

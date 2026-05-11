export interface InvestorCredential {
    username: string
    password: string
    displayName: string
    accessTo: string[] | '*'
    disabled?: boolean
    createdAt: string
}

// Public demo credentials. These ship in the open-source repo so anyone can
// clone, run, and walk the deck library without setup. Replace with your own
// before pointing real investors at a deployment.
export const INVESTOR_CREDENTIALS: InvestorCredential[] = [
    {
        username: 'demo@nopoint.dev',
        password: 'demo-2026-public',
        displayName: 'Demo Investor',
        accessTo: ['seed-2026', 'airbnb', 'buffer', 'hummingbird'],
        createdAt: '2026-05-06T00:00:00Z',
    },
    {
        username: 'partner@nopoint.dev',
        password: 'partner-2026-public',
        displayName: 'Demo Partner (full access)',
        accessTo: '*',
        createdAt: '2026-05-06T00:00:00Z',
    },
]

export const INVESTOR_SESSION_SECRET =
    process.env.INVESTOR_SESSION_SECRET ?? 'dev-only-change-me-in-prod'

if (process.env.NODE_ENV === 'production' && !process.env.INVESTOR_SESSION_SECRET) {
    throw new Error('INVESTOR_SESSION_SECRET must be set in production')
}

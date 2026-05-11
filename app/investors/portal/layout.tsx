import { redirect } from 'next/navigation'
import { requireInvestor } from '@/lib/investors/guard.server'
import type { ReactNode } from 'react'

export default async function PortalLayout({ children }: { children: ReactNode }) {
    const cred = await requireInvestor()
    if (!cred) redirect('/investors/login')
    return <>{children}</>
}

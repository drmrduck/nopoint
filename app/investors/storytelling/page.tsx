import { redirect } from 'next/navigation'
import { requireInvestor } from '@/lib/investors/guard.server'
import { StorytellingShell } from '@/components/storytelling/storytelling-shell'

export default async function StorytellingPage() {
    const cred = await requireInvestor()
    if (!cred) redirect('/investors/login')

    return <StorytellingShell />
}

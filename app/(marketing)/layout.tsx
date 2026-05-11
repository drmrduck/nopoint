import type { ReactNode } from 'react'
import { GithubCornerLink } from '@/components/github-corner-link'

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <GithubCornerLink />
        </>
    )
}

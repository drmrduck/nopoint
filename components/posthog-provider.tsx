'use client'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PostHogProvider as PostHogReactProvider, usePostHog } from 'posthog-js/react'

/**
 * Set `NEXT_PUBLIC_POSTHOG_KEY` (and optionally `NEXT_PUBLIC_POSTHOG_HOST`,
 * default `https://us.i.posthog.com`) in your env to enable analytics.
 * If the key is absent, this provider is a transparent pass-through and
 * posthog-js never initialises — forks ship with no analytics by default.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    if (!POSTHOG_KEY) return <>{children}</>
    return (
        <PostHogReactProvider
            apiKey={POSTHOG_KEY}
            options={{
                api_host: POSTHOG_HOST,
                person_profiles: 'identified_only',
                // App Router fires its own pageview events via PageViewTracker
                // below — disable the SDK's automatic capture so we don't
                // double-count.
                capture_pageview: false,
            }}
        >
            <Suspense fallback={null}>
                <PageViewTracker />
            </Suspense>
            {children}
        </PostHogReactProvider>
    )
}

function PageViewTracker() {
    const posthog = usePostHog()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!posthog || !pathname) return
        const qs = searchParams?.toString()
        const url = qs ? `${pathname}?${qs}` : pathname
        posthog.capture('$pageview', { $current_url: url })
    }, [posthog, pathname, searchParams])

    return null
}

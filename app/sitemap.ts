import type { MetadataRoute } from 'next'
import { COMPARISONS } from '@/lib/comparisons'
import { PUBLIC_DECK_IDS } from '@/lib/decks/visibility'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/getting-started`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/vs`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    const deckRoutes: MetadataRoute.Sitemap = PUBLIC_DECK_IDS.map((id) => ({
        url: `${SITE_URL}/investors/decks/${id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    const comparisonRoutes: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
        url: `${SITE_URL}/vs/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
    }))

    return [...staticRoutes, ...deckRoutes, ...comparisonRoutes]
}

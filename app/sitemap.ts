import type { MetadataRoute } from 'next'
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
    ]

    const deckRoutes: MetadataRoute.Sitemap = PUBLIC_DECK_IDS.map((id) => ({
        url: `${SITE_URL}/investors/decks/${id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [...staticRoutes, ...deckRoutes]
}

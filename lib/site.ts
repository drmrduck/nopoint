// Canonical site URL for SEO metadata, sitemaps, robots.txt, JSON-LD, and
// OG images. Override per-deployment with NEXT_PUBLIC_SITE_URL — required
// for any fork or self-hosted deployment so canonical tags don't point at
// the upstream nopoint.app demo.
//
// Precedence:
//   1. NEXT_PUBLIC_SITE_URL (set this on your Vercel project / .env.local)
//   2. https://<VERCEL_PROJECT_PRODUCTION_URL> (auto-set by Vercel)
//   3. https://nopoint.app (upstream OSS demo — last-resort fallback)
const FALLBACK_SITE_URL = 'https://nopoint.app'

function normalizeSiteUrl(raw: string | null | undefined): { url: string; usedFallback: boolean } {
    if (!raw) return { url: FALLBACK_SITE_URL, usedFallback: true }
    const trimmed = raw.trim().replace(/\/$/, '')
    if (!trimmed) return { url: FALLBACK_SITE_URL, usedFallback: true }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    try {
        return { url: new URL(withProtocol).toString().replace(/\/$/, ''), usedFallback: false }
    } catch {
        return { url: FALLBACK_SITE_URL, usedFallback: true }
    }
}

const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)

const resolved = normalizeSiteUrl(explicitSiteUrl)

export const SITE_URL: string = resolved.url
export const SITE_HOST: string = new URL(SITE_URL).host

// OSS guard rail: if a fork hasn't set NEXT_PUBLIC_SITE_URL and isn't on Vercel,
// every canonical tag, sitemap entry, and OG URL will point at the upstream demo.
// Warn loudly in dev/build so people don't ship a fork that SEO-credits nopoint.app.
if (resolved.usedFallback && process.env.NODE_ENV !== 'test' && typeof window === 'undefined') {
    const reason = explicitSiteUrl ? `invalid value ${JSON.stringify(explicitSiteUrl)}` : 'unset'
    // eslint-disable-next-line no-console
    console.warn(
        `[nopoint] NEXT_PUBLIC_SITE_URL is ${reason}; falling back to ${FALLBACK_SITE_URL}.\n` +
            `         Set NEXT_PUBLIC_SITE_URL in .env.local (or your Vercel project) to your own domain\n` +
            `         (e.g. https://pitch.yourdomain.com) so canonical/OG/sitemap URLs are correct.`,
    )
}

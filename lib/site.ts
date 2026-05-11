// Canonical site URL for SEO metadata, sitemaps, robots.txt, JSON-LD, and
// OG images. Override per-deployment with NEXT_PUBLIC_SITE_URL — required
// for any fork or self-hosted deployment so canonical tags don't point at
// the upstream nopoint.app demo.
//
// Precedence:
//   1. NEXT_PUBLIC_SITE_URL (set this on your Vercel project / .env.local)
//   2. https://<VERCEL_PROJECT_PRODUCTION_URL> (auto-set by Vercel)
//   3. https://nopoint.app (upstream OSS demo — last-resort fallback)
export const SITE_URL: string = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : null) ??
    'https://nopoint.app'
).replace(/\/$/, '')

export const SITE_HOST: string = new URL(SITE_URL).host

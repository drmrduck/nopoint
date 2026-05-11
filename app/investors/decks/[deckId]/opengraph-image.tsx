import { ImageResponse } from 'next/og'
import { DECKS } from '@/components/decks'
import { isPublicDeck } from '@/lib/decks/visibility'
import { SITE_HOST } from '@/lib/site'

export const alt = '🛝 NoPoint deck preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// `dev` mode regenerates the route on every request automatically; in prod the
// content is derived purely from the static deck registry, so default caching
// is fine. We only need to make sure the *browser* doesn't hold a stale copy
// while the OG template is being iterated on locally — a `Cache-Control:
// no-store` header on the dev response handles that without disabling Next's
// production caching.
const NO_CACHE_HEADERS: Record<string, string> | undefined =
    process.env.NODE_ENV === 'development'
        ? { 'cache-control': 'no-store, max-age=0, must-revalidate' }
        : undefined

interface Props {
    params: Promise<{ deckId: string }>
}

// Per-deck visual treatments. Keep concise — Satori does not process Tailwind,
// every visual must be inline. These tints differentiate decks at a glance in
// the social preview.
interface DeckTheme {
    gradient: string
    accent: string
    tag: string
    /** When true, switches text/chip colors to dark — used by light/cream themes. */
    light?: boolean
}

const DECK_THEMES: Record<string, DeckTheme> = {
    'seed-2026': {
        gradient: 'linear-gradient(135deg, #050505 0%, #1a1004 60%, #2a1404 100%)',
        accent: '#f97316',
        tag: 'SEED · 2026',
    },
    sequoia: {
        gradient: 'linear-gradient(135deg, #050a14 0%, #0a1a2c 60%, #102945 100%)',
        accent: '#60a5fa',
        tag: 'TEMPLATE · SEQUOIA',
    },
    chartpasta: {
        gradient: 'linear-gradient(135deg, #1a1404 0%, #2a1f08 60%, #3a2a08 100%)',
        accent: '#fbbf24',
        tag: 'AL DENTE',
    },
    'rr-diner': {
        gradient: 'linear-gradient(135deg, #2b0d0a 0%, #4a1814 60%, #6a1f15 100%)',
        accent: '#f87171',
        tag: 'COFFEE · BLACK',
    },
    im: {
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 60%, #2a2a2a 100%)',
        accent: '#a3a3a3',
        tag: 'INFORMATION MEMORANDUM',
    },
    'nopoint-duedil': {
        gradient: 'linear-gradient(135deg, #0a0a14 0%, #14142a 60%, #1f1f3f 100%)',
        accent: '#a78bfa',
        tag: 'DUE DILIGENCE',
    },
    airbnb: {
        gradient: 'linear-gradient(135deg, #FAF6F0 0%, #F0E6DE 60%, #E8D9CE 100%)',
        accent: '#FF5A5F',
        tag: 'AIRBED&BREAKFAST · 2009',
        light: true,
    },
    buffer: {
        gradient: 'linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 60%, #D6E8F7 100%)',
        accent: '#168EEA',
        tag: 'BUFFER · 2013',
        light: true,
    },
}

function truncate(text: string, max: number): string {
    if (text.length <= max) return text
    // Trim back to the last word boundary so we never cut mid-word.
    const sliced = text.slice(0, max - 1)
    const lastSpace = sliced.lastIndexOf(' ')
    const base = lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced
    return `${base.replace(/[\s\p{P}]+$/u, '')}…`
}

const FALLBACK_THEME = {
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #18120a 60%, #2a1404 100%)',
    accent: '#f97316',
    tag: 'NOPOINT DECK',
}

export default async function Image({ params }: Props) {
    const { deckId } = await params
    const deck = DECKS.find((d) => d.id === deckId)
    const theme = DECK_THEMES[deckId] ?? FALLBACK_THEME
    const isPublic = isPublicDeck(deckId)

    const title = deck?.title ?? 'Deck not found'
    // Defensive cap: at 32px / lineHeight 1.3 the description renders ~62
    // chars/line. Three lines = ~180 visible chars before wrapping into the
    // footer. We truncate at 150 with an ellipsis so a slightly-overlong
    // registry entry never clips the URL row, but keep the registry entries
    // themselves short — see the NOTE in components/decks/index.ts.
    const rawDescription =
        deck?.description ?? 'This deck is not part of the 🛝 NoPoint registry.'
    const description = truncate(rawDescription, 150)
    const slideCount = deck?.slides.length ?? 0

    // Light themes flip the text/chip colors so cream backgrounds stay readable.
    const textPrimary = theme.light ? '#1B1A1B' : '#ffffff'
    const textSubtle = theme.light ? 'rgba(27,26,27,0.65)' : 'rgba(255,255,255,0.62)'
    const textFaint = theme.light ? 'rgba(27,26,27,0.45)' : 'rgba(255,255,255,0.45)'
    const textGhost = theme.light ? 'rgba(27,26,27,0.3)' : 'rgba(255,255,255,0.3)'
    const chipBorder = theme.light ? 'rgba(27,26,27,0.18)' : 'rgba(255,255,255,0.18)'
    const chipBg = theme.light ? 'rgba(27,26,27,0.05)' : 'rgba(255,255,255,0.05)'
    const chipText = theme.light ? 'rgba(27,26,27,0.65)' : 'rgba(255,255,255,0.55)'
    const publicChipBorder = theme.light
        ? 'rgba(5,150,105,0.45)'
        : 'rgba(52,211,153,0.45)'
    const publicChipBg = theme.light ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.12)'
    const publicChipText = theme.light ? '#047857' : '#6ee7b7'

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: theme.gradient,
                    color: textPrimary,
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                    padding: '72px 84px',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: -180,
                        right: -180,
                        width: 580,
                        height: 580,
                        background: `radial-gradient(circle, ${theme.accent}55 0%, transparent 70%)`,
                        display: 'flex',
                    }}
                />

                {/* Header row: brand + visibility + slide count */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: 999,
                                background: theme.accent,
                                display: 'flex',
                            }}
                        />
                        <div
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                letterSpacing: 6,
                                textTransform: 'uppercase',
                                color: theme.accent,
                                display: 'flex',
                            }}
                        >
                            🛝 NoPoint · {theme.tag}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '10px 16px',
                                borderRadius: 999,
                                border: `1px solid ${theme.accent}55`,
                                background: `${theme.accent}1f`,
                                color: theme.accent,
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                            }}
                        >
                            <span style={{ display: 'flex', fontSize: 22 }}>{slideCount}</span>
                            <span style={{ display: 'flex' }}>
                                slide{slideCount === 1 ? '' : 's'}
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '10px 16px',
                                borderRadius: 999,
                                border: `1px solid ${
                                    isPublic ? publicChipBorder : chipBorder
                                }`,
                                background: isPublic ? publicChipBg : chipBg,
                                color: isPublic ? publicChipText : chipText,
                                fontSize: 18,
                                fontWeight: 700,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                            }}
                        >
                            {isPublic ? '🌐  Public' : '🔒  Private'}
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div
                    style={{
                        marginTop: 64,
                        fontSize: title.length > 28 ? 88 : 108,
                        fontWeight: 800,
                        lineHeight: 1.02,
                        letterSpacing: -3,
                        display: 'flex',
                        maxWidth: '100%',
                    }}
                >
                    {title}
                </div>

                {/* Description */}
                <div
                    style={{
                        marginTop: 22,
                        fontSize: 32,
                        lineHeight: 1.3,
                        fontWeight: 500,
                        color: textSubtle,
                        display: 'flex',
                        maxWidth: 980,
                    }}
                >
                    {description}
                </div>

                <div style={{ flex: 1, display: 'flex' }} />

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        fontSize: 22,
                        color: textFaint,
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex' }}>{SITE_HOST}</div>
                        <div
                            style={{
                                display: 'flex',
                                color: textGhost,
                                fontSize: 18,
                            }}
                        >
                            /investors/decks/{deckId}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            color: chipText,
                            fontSize: 20,
                            fontWeight: 600,
                        }}
                    >
                        Pitch decks as code
                    </div>
                </div>
            </div>
        ),
        { ...size, headers: NO_CACHE_HEADERS },
    )
}

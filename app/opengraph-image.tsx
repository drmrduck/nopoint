import { ImageResponse } from 'next/og'
import { SITE_HOST } from '@/lib/site'

export const alt = '🛝 NoPoint — Pitch decks vibe coded'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default OG image for the site. Routes under /investors/* ship their own
// `opengraph-image.tsx` and override this one. The output is purely a function
// of the registry-free constants below, so Next statically optimizes the route
// at build time. We only suppress the *browser* cache during local dev so that
// iterating on the layout doesn't require a hard reload.
const NO_CACHE_HEADERS: Record<string, string> | undefined =
    process.env.NODE_ENV === 'development'
        ? { 'cache-control': 'no-store, max-age=0, must-revalidate' }
        : undefined

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background:
                        'linear-gradient(135deg, #07080d 0%, #0b1430 55%, #0a1f55 100%)',
                    color: '#ffffff',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                    position: 'relative',
                }}
            >
                {/* Top-left blue glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: -220,
                        left: -180,
                        width: 720,
                        height: 720,
                        background:
                            'radial-gradient(circle, rgba(59,130,246,0.55) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />
                {/* Bottom-right deeper blue glow */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: -260,
                        right: -200,
                        width: 760,
                        height: 760,
                        background:
                            'radial-gradient(circle, rgba(29,78,216,0.6) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* LEFT: brand block */}
                <div
                    style={{
                        flex: '0 0 46%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '0 56px 0 84px',
                        gap: 28,
                    }}
                >
                    <div
                        style={{
                            fontSize: 220,
                            lineHeight: 1,
                            display: 'flex',
                            filter: 'drop-shadow(0 12px 32px rgba(59,130,246,0.55))',
                        }}
                    >
                        🛝
                    </div>
                    <div
                        style={{
                            fontSize: 88,
                            fontWeight: 800,
                            letterSpacing: -3,
                            lineHeight: 1,
                            display: 'flex',
                        }}
                    >
                        NoPoint
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '8px 16px',
                            borderRadius: 999,
                            border: '1px solid rgba(147,197,253,0.45)',
                            background: 'rgba(59,130,246,0.14)',
                            color: '#bfdbfe',
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: 6,
                            textTransform: 'uppercase',
                        }}
                    >
                        All POWER
                    </div>
                </div>

                {/* Vertical divider */}
                <div
                    style={{
                        width: 1,
                        background:
                            'linear-gradient(to bottom, transparent 0%, rgba(147,197,253,0.35) 30%, rgba(147,197,253,0.35) 70%, transparent 100%)',
                        display: 'flex',
                    }}
                />

                {/* RIGHT: heading */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '0 84px 0 64px',
                        gap: 28,
                    }}
                >
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 700,
                            letterSpacing: 6,
                            textTransform: 'uppercase',
                            color: '#93c5fd',
                            display: 'flex',
                        }}
                    >
                        {SITE_HOST}
                    </div>
                    <div
                        style={{
                            fontSize: 92,
                            fontWeight: 800,
                            letterSpacing: -3,
                            lineHeight: 1.02,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <span style={{ display: 'flex' }}>Pitch decks</span>
                        <span
                            style={{
                                display: 'flex',
                                background:
                                    'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
                                backgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            vibe coded
                        </span>
                    </div>
                    <div
                        style={{
                            fontSize: 26,
                            color: 'rgba(191,219,254,0.75)',
                            display: 'flex',
                        }}
                    >
                        Programmable slides · investor portals · exportable runtimes
                    </div>
                </div>
            </div>
        ),
        { ...size, headers: NO_CACHE_HEADERS },
    )
}

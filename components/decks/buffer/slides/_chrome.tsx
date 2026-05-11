import type { ReactNode } from 'react'

// Visual chrome for the Buffer 2013 deck — faithful recreation:
// linen/cream paper background, heavy black Helvetica headlines, dash bullets,
// Buffer green for accents, stacked-sheets wordmark bottom-left.

export const BUFFER_PALETTE = {
    paper: '#EFEEEA',
    paperSoft: '#F4F2EC',
    paperEdge: '#E0DCCF',
    paperWhite: '#FFFFFF',
    ink: '#0A0A0A',
    inkSoft: '#3A3A3A',
    inkFaint: 'rgba(10, 10, 10, 0.4)',
    green: '#62A744',
    greenSoft: 'rgba(98, 167, 68, 0.12)',
    greenBorder: 'rgba(98, 167, 68, 0.35)',
    rule: 'rgba(10, 10, 10, 0.10)',
    // Legacy aliases — older slides imported these names. Re-routed to the
    // new theme so the old code paints in black/green instead of navy/blue.
    blue: '#0A0A0A',
    blueSoft: 'rgba(98, 167, 68, 0.12)',
    blueBorder: 'rgba(98, 167, 68, 0.35)',
} as const

export const BUFFER_FONT =
    '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif'

const PAPER_TEXTURE_DARK = 'rgba(0, 0, 0, 0.035)'

export function BufferSlide({
    children,
    className = '',
    showWordmark = true,
}: {
    children: ReactNode
    className?: string
    showWordmark?: boolean
}) {
    return (
        <div
            className={`relative h-full w-full overflow-hidden ${className}`}
            style={{
                background: BUFFER_PALETTE.paper,
                backgroundImage: `repeating-linear-gradient(0deg, ${PAPER_TEXTURE_DARK} 0px, ${PAPER_TEXTURE_DARK} 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, ${PAPER_TEXTURE_DARK} 0px, ${PAPER_TEXTURE_DARK} 1px, transparent 1px, transparent 3px)`,
                color: BUFFER_PALETTE.ink,
                fontFamily: BUFFER_FONT,
            }}
        >
            {children}
            {showWordmark && (
                <div className="absolute bottom-7 left-10 z-10">
                    <BufferWordmark />
                </div>
            )}
        </div>
    )
}

export function BufferWordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const dims = size === 'lg' ? 44 : size === 'sm' ? 28 : 36
    const text = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-2xl' : 'text-4xl'
    return (
        <div className="flex items-center gap-2.5" style={{ color: BUFFER_PALETTE.ink }}>
            <svg width={dims} height={dims * 0.92} viewBox="0 0 44 40" aria-hidden>
                <path
                    d="M22 2 L42 11 L22 20 L2 11 Z"
                    fill={BUFFER_PALETTE.ink}
                    opacity="0.95"
                />
                <path
                    d="M2 20 L22 29 L42 20"
                    fill="none"
                    stroke={BUFFER_PALETTE.ink}
                    strokeWidth="3"
                    opacity="0.7"
                />
                <path
                    d="M2 29 L22 38 L42 29"
                    fill="none"
                    stroke={BUFFER_PALETTE.ink}
                    strokeWidth="3"
                    opacity="0.45"
                />
            </svg>
            <span
                className={`${text} font-black tracking-tight leading-none`}
                style={{ color: BUFFER_PALETTE.ink }}
            >
                buffer
            </span>
        </div>
    )
}

export function BufferHeadline({
    eyebrow,
    title,
    align = 'left',
}: {
    eyebrow?: string
    title: string
    align?: 'left' | 'center'
}) {
    return (
        <div
            className={`px-20 pt-14 ${align === 'center' ? 'text-center' : ''}`}
        >
            {eyebrow && (
                <p
                    className="text-xs font-black uppercase tracking-[0.32em] mb-4"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    {eyebrow}
                </p>
            )}
            <h2
                className="text-7xl font-black tracking-tight leading-[1.02]"
                style={{ color: BUFFER_PALETTE.ink }}
            >
                {title}
            </h2>
        </div>
    )
}

// Big centered title used on slides with no eyebrow, like the reference image.
export function BufferTitle({
    children,
    className = '',
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <h1
            className={`text-center font-black tracking-tight leading-[1.02] ${className}`}
            style={{ color: BUFFER_PALETTE.ink, fontSize: 132 }}
        >
            {children}
        </h1>
    )
}

// Dash-bulleted list — the "- 6 integrations so far" style from the reference image.
export function BufferBullets({
    items,
    className = '',
    size = 'md',
}: {
    items: ReactNode[]
    className?: string
    size?: 'md' | 'lg'
}) {
    const text =
        size === 'lg' ? 'text-3xl' : 'text-2xl'
    return (
        <ul className={`flex flex-col gap-6 ${className}`}>
            {items.map((item, i) => (
                <li
                    key={i}
                    className={`${text} font-black flex gap-4 leading-snug`}
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    <span aria-hidden className="select-none">-</span>
                    <span className="flex-1">{item}</span>
                </li>
            ))}
        </ul>
    )
}

import type { ReactNode } from 'react'

// Shared visual shell for the AirBed&Breakfast 2009 deck. Cream background,
// ink text, Rausch-red accent. Keep this lean — slides should describe their
// own content, not their own paint.

export const AIRBNB_PALETTE = {
    paper: '#FAF6F0',
    ink: '#1B1A1B',
    inkSoft: '#5C5A58',
    rausch: '#FF5A5F',
    rausch30: 'rgba(255, 90, 95, 0.30)',
    rausch10: 'rgba(255, 90, 95, 0.10)',
    rule: 'rgba(27, 26, 27, 0.12)',
} as const

export function AirbnbSlide({
    children,
    className = '',
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div
            className={`relative h-full w-full overflow-hidden ${className}`}
            style={{ background: AIRBNB_PALETTE.paper, color: AIRBNB_PALETTE.ink }}
        >
            {children}
        </div>
    )
}

export function AirbnbHeadline({
    eyebrow,
    title,
    accent = false,
}: {
    eyebrow?: string
    title: string
    accent?: boolean
}) {
    return (
        <div className="px-20 pt-16">
            {eyebrow && (
                <p
                    className="text-[11px] font-bold uppercase tracking-[0.32em] mb-5"
                    style={{ color: AIRBNB_PALETTE.rausch }}
                >
                    {eyebrow}
                </p>
            )}
            <h2
                className="text-5xl font-bold tracking-tight leading-[1.05]"
                style={{ color: accent ? AIRBNB_PALETTE.rausch : AIRBNB_PALETTE.ink }}
            >
                {title}
            </h2>
            <div
                className="mt-7 h-px w-24"
                style={{ background: AIRBNB_PALETTE.rausch }}
            />
        </div>
    )
}

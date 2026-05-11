'use client'
import { useLayoutEffect, useRef, useState } from 'react'
import { SLIDE_DESIGN_HEIGHT, SLIDE_DESIGN_WIDTH } from './viewer-types'

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Renders children at the fixed design resolution
 * (SLIDE_DESIGN_WIDTH × SLIDE_DESIGN_HEIGHT) and CSS-scales the result to fit
 * the parent. The parent must be a positioned (relative/absolute) element
 * with a real size.
 *
 *   mode='fit'   contain — scale to the smaller of (w/W, h/H), letterboxed.
 *                Used for full-bleed and any non-16:9 container.
 *   mode='fill'  scale to width — assumes the parent already has a 16:9
 *                aspect ratio. Slightly cheaper/sharper than 'fit'.
 *
 * If a child slide ever wants to opt out of scaling (rare), do not nest it
 * inside ScaledStage. Default behaviour for every view mode: SCALED.
 */
export function ScaledStage({
    children,
    mode = 'fit',
    background = true,
}: {
    children: React.ReactNode
    mode?: 'fit' | 'fill'
    background?: boolean
}) {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    useLayoutEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        const compute = (w: number, h: number) => {
            if (w <= 0 || h <= 0) return
            const next =
                mode === 'fill'
                    ? w / SLIDE_DESIGN_WIDTH
                    : Math.min(w / SLIDE_DESIGN_WIDTH, h / SLIDE_DESIGN_HEIGHT)
            setScale(next)
        }
        compute(el.clientWidth, el.clientHeight)
        const ro = new ResizeObserver(([entry]) => {
            compute(entry.contentRect.width, entry.contentRect.height)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [mode])

    return (
        <div
            ref={wrapperRef}
            className={cx(
                'absolute inset-0 overflow-hidden flex items-center justify-center',
                background && 'bg-zinc-950',
            )}
        >
            <div
                className="shrink-0"
                style={{
                    width: SLIDE_DESIGN_WIDTH,
                    height: SLIDE_DESIGN_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export function ScaledThumb({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative w-full bg-zinc-950"
            style={{ aspectRatio: `${SLIDE_DESIGN_WIDTH} / ${SLIDE_DESIGN_HEIGHT}` }}
        >
            <ScaledStage mode="fill">{children}</ScaledStage>
        </div>
    )
}

/**
 * Portrait-iPhone bezel with the slide as a 16:9 strip centred vertically
 * inside the screen — exactly what a phone in portrait would show. Sized to
 * fit the available height so it looks sensible on a laptop screen.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="relative shrink-0"
            style={{
                aspectRatio: '9 / 19.5',
                height: 'min(100%, 760px)',
            }}
        >
            {/* Bezel */}
            <div className="absolute inset-0 rounded-[12%/5.5%] bg-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10" />
            {/* Power / volume buttons (decorative) */}
            <div className="absolute -right-[3px] top-[24%] h-[8%] w-[3px] rounded-r bg-zinc-700/60" />
            <div className="absolute -left-[3px] top-[18%] h-[5%] w-[3px] rounded-l bg-zinc-700/60" />
            <div className="absolute -left-[3px] top-[26%] h-[7%] w-[3px] rounded-l bg-zinc-700/60" />
            <div className="absolute -left-[3px] top-[36%] h-[7%] w-[3px] rounded-l bg-zinc-700/60" />
            {/* Inner screen */}
            <div className="absolute inset-[3%] rounded-[10%/4.8%] bg-black overflow-hidden">
                {/* Notch */}
                <div className="absolute top-[1.4%] left-1/2 -translate-x-1/2 h-[3.2%] w-[36%] rounded-full bg-black z-20" />
                {/* Slide as horizontal strip, centred vertically */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="relative w-full bg-zinc-950"
                        style={{ aspectRatio: `${SLIDE_DESIGN_WIDTH} / ${SLIDE_DESIGN_HEIGHT}` }}
                    >
                        {children}
                    </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-[1%] left-1/2 -translate-x-1/2 h-[0.5%] w-[34%] rounded-full bg-white/40 z-20" />
            </div>
        </div>
    )
}

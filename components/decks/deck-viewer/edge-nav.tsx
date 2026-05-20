import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from './utils'

export function EdgeNav({
    side,
    smOnly,
    disabled,
    onTap,
}: {
    side: 'left' | 'right'
    /**
     * When true, the entire control hides on viewports >= sm. Used in
     * card/full views where the bottom-bar prev/next button already covers
     * the desktop case. In mobile-preview view we want it on every viewport.
     */
    smOnly: boolean
    disabled: boolean
    onTap: () => void
}) {
    if (disabled) return null
    const isLeft = side === 'left'
    return (
        <button
            type="button"
            aria-label={isLeft ? 'Previous slide' : 'Next slide'}
            onClick={onTap}
            className={cx(
                'absolute top-0 bottom-0 w-[28%] max-w-[180px] z-10 flex items-center group',
                // Visible on touch viewports (no hover available); hidden by
                // default on desktop and revealed on hover/focus.
                'opacity-70 sm:opacity-0 sm:hover:opacity-100 sm:focus-visible:opacity-100 transition-opacity',
                isLeft ? 'left-0 justify-start pl-2 sm:pl-3' : 'right-0 justify-end pr-2 sm:pr-3',
                smOnly && 'sm:hidden',
            )}
        >
            <span className="rounded-full p-2 bg-black/55 backdrop-blur-sm ring-1 ring-white/10 text-white/90 group-hover:bg-black/70 group-active:bg-blue-500/50 transition-colors">
                {isLeft ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </span>
        </button>
    )
}

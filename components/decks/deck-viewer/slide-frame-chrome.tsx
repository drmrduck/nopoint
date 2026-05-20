import type { DeckChrome } from '../types'
import { cx } from './utils'

export function SlideFrameChrome({
    deckChrome,
    currentSlideNumber,
    slideNumberText,
    showNumber,
    showWatermark,
}: {
    deckChrome: DeckChrome
    currentSlideNumber: number
    slideNumberText: string
    showNumber: boolean
    showWatermark: boolean
}) {
    const brandVisible = !!deckChrome.brand && currentSlideNumber >= (deckChrome.brandVisibleFromSlide ?? 1)
    const slideNumberVisible = showNumber && deckChrome.slideNumber?.enabled !== false && !!deckChrome.slideNumber
    const watermarkVisible = showWatermark && !!deckChrome.watermark?.text

    if (!brandVisible && !slideNumberVisible && !watermarkVisible) return null

    return (
        <>
            {brandVisible && (
                <div
                    className={cx(
                        'absolute top-5 left-6 pointer-events-none select-none z-20',
                        deckChrome.brand?.containerClassName,
                    )}
                >
                    {deckChrome.brand?.kind === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={deckChrome.brand.src}
                            alt={deckChrome.brand.alt ?? ''}
                            aria-hidden={deckChrome.brand.alt ? undefined : true}
                            className={cx('h-6 w-auto', deckChrome.brand.className)}
                        />
                    ) : (
                        <span
                            className={cx(
                                'text-xs font-semibold uppercase tracking-[0.28em] text-white/32',
                                deckChrome.brand?.className,
                            )}
                        >
                            {deckChrome.brand?.text}
                        </span>
                    )}
                </div>
            )}

            {slideNumberVisible && deckChrome.slideNumber && (
                <div className={deckChrome.slideNumber.containerClassName}>
                    <span className={deckChrome.slideNumber.className}>
                        {deckChrome.slideNumber.prefix}
                        {slideNumberText}
                        {deckChrome.slideNumber.suffix}
                    </span>
                </div>
            )}

            {watermarkVisible && (
                <div className={deckChrome.watermark?.className}>
                    {deckChrome.watermark?.text}
                </div>
            )}
        </>
    )
}

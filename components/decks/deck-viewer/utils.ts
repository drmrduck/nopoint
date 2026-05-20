import type { DeckChrome, DeckDefinition, SlideDefinition } from '../types'

export function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

export function resolveDeckChrome(deck: DeckDefinition): DeckChrome {
    return {
        brandVisibleFromSlide: deck.chrome?.brandVisibleFromSlide ?? 1,
        brand: deck.chrome?.brand ?? (
            deck.logoUrl
                ? {
                    kind: 'image',
                    src: deck.logoUrl,
                    className: 'h-6 w-auto opacity-40',
                }
                : undefined
        ),
        slideNumber: {
            enabled: deck.chrome?.slideNumber?.enabled ?? true,
            format: deck.chrome?.slideNumber?.format ?? 'padded',
            className:
                deck.chrome?.slideNumber?.className ??
                'text-xs font-semibold tracking-[0.32em] tabular-nums text-white/35',
            containerClassName:
                deck.chrome?.slideNumber?.containerClassName ??
                'absolute top-5 right-16 pointer-events-none select-none z-20',
            prefix: deck.chrome?.slideNumber?.prefix,
            suffix: deck.chrome?.slideNumber?.suffix,
        },
        watermark: {
            text: deck.chrome?.watermark?.text ?? `CONFIDENTIAL — ${deck.title}`,
            className:
                deck.chrome?.watermark?.className ??
                'absolute bottom-4 right-5 text-[11px] text-white/20 pointer-events-none select-none z-20',
        },
    }
}

export function resolveSlideComponent(slide: SlideDefinition, variantKey: string | undefined) {
    if (variantKey && slide.variants?.[variantKey]) {
        return slide.variants[variantKey].component
    }
    if (slide.defaultVariant && slide.variants?.[slide.defaultVariant]) {
        return slide.variants[slide.defaultVariant].component
    }
    return slide.component
}

import type { ComponentType } from 'react'

export interface SlideContext {
    category: string
    principles: string[]
    goals?: string[]
    whatItIsNot?: string
    nailsThis: string
    storyThread: string
}

export interface SlideVariant {
    label: string
    component: ComponentType
}

export interface SlideDefinition {
    id: string
    title: string
    component: ComponentType
    context?: SlideContext
    controls?: ComponentType
    /**
     * When true, the `controls` component is exposed in production via a
     * Controls toggle pill next to the Context widget. When false/undefined,
     * `controls` is a dev-only convenience shown in the yellow LOCAL panel.
     */
    publicControls?: boolean
    variants?: Record<string, SlideVariant>
    defaultVariant?: string
    /**
     * Chartcastr source IDs this slide embeds. The deck-viewer prefetches
     * these on deck mount so that <ChartcastrSource> renders instantly when
     * the slide is reached, even on slow networks.
     */
    chartcastrSourceIds?: readonly string[]
}

export interface DeckContact {
    email?: string
    twitter?: string
    linkedin?: string
    phone?: string
}

export interface DeckChromeBrandImage {
    kind: 'image'
    src: string
    alt?: string
    className?: string
    containerClassName?: string
}

export interface DeckChromeBrandText {
    kind: 'text'
    text: string
    className?: string
    containerClassName?: string
}

export type DeckChromeBrand = DeckChromeBrandImage | DeckChromeBrandText

export interface DeckSlideNumberChrome {
    enabled?: boolean
    format?: 'plain' | 'padded'
    className?: string
    containerClassName?: string
    prefix?: string
    suffix?: string
}

export interface DeckWatermarkChrome {
    text?: string
    className?: string
}

export interface DeckChrome {
    brand?: DeckChromeBrand
    brandVisibleFromSlide?: number
    slideNumber?: DeckSlideNumberChrome
    watermark?: DeckWatermarkChrome
}

export interface DeckDefinition {
    id: string
    title: string
    description: string
    slides: SlideDefinition[]
    /**
     * `'live'` marks the one canonical, data-wired demonstrator deck — the one
     * that shows nopoint "for real" (live Chartcastr data, the full runtime).
     * Everything else is `'example'` (a reference template, recreation, or gag).
     * Defaults to `'example'` when omitted. The deck library and homepage use
     * this to feature the live deck and group the rest under "Examples".
     */
    kind?: 'live' | 'example'
    logoUrl?: string
    pdfFilename?: string
    contact?: DeckContact
    chrome?: DeckChrome
    /**
     * When true, the deck is reachable at /investors/decks/<id> without an
     * investor session. Derived from PUBLIC_DECK_IDS in
     * `lib/decks/visibility.ts` — do not set this manually on a deck literal,
     * the registry stamps it on at module load.
     */
    public?: boolean
    /**
     * Live multiplayer cursors for this deck. Stamped at module load from
     * `NEXT_PUBLIC_MULTIPLAYER_ENABLED` (default on). Set explicit `false`
     * on a deck literal to opt this deck out regardless of the env flag.
     */
    multiplayer?: boolean
}

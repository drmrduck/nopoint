export type ViewMode = 'card' | 'full' | 'grid' | 'scroll' | 'mobile'

// Mirror of `ViewModePref` from `lib/preferences` — re-declared here so the
// shared viewer-state helpers don't need to depend on a 'use client' module.
export type ViewModePref = 'card' | 'full' | 'grid' | 'scroll' | 'mobile'

/**
 * Slides are authored against a fixed 1280×720 design canvas. Every viewport
 * (card / full / grid / scroll / mobile) renders the slide at this size and
 * CSS-scales it to fit. This is the guard rail: a slide that uses Tailwind
 * pixel sizes (text-8xl, px-24, …) will look identical on a 4K monitor and a
 * portrait phone — the content never reflows, just rescales.
 */
export const SLIDE_DESIGN_WIDTH = 1280
export const SLIDE_DESIGN_HEIGHT = 720

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Authoring decks in nopoint

Read `README.md` first for the user-facing overview. This file documents the conventions an AI assistant must follow when editing slides.

## The slide context contract

Every slide in `slides/index.ts` has an optional `context` field. The preferred shape is:

```ts
context: {
    category: string         // short label in the widget header
    principles: string[]     // design rules this slide satisfies
    goals?: string[]         // concrete jobs this slide must do
    whatItIsNot?: string     // what this slide must NOT drift into
    nailsThis: string        // what this slide is actually doing, in one honest sentence
    storyThread: string      // how it picks up the previous slide and sets up the next
}
```

**The `SlideContextWidget` (hotkey `C`) reads these fields live.** They are the source of truth for "why is this slide here." The DECK.md is the source of truth for the deck-wide rules; `context.principles` is where you cite which rules a specific slide satisfies.

**AI editing rule: when you edit a slide component, update `context.nailsThis`, `context.goals`, `context.whatItIsNot`, and `context.storyThread` to match.** If you can't update them honestly, you've changed what the slide is for — flag that to the user before continuing.

For any slide you touch, the widget should answer four questions clearly:

- What is this slide?
- What jobs must it do?
- What is it explicitly not trying to do?
- How does it connect to the surrounding story?

Legacy slides may omit `goals` / `whatItIsNot`, but any slide you edit should leave with those fields populated.

## Variants

Slides with multiple visual treatments use the `<slide-id>-variants/` subfolder convention:

```
slides/
    problem-slide.tsx                    ← default component
    problem-variants/
        monday-morning.tsx               ← variant component
        three-truths.tsx                 ← variant component
        options.notes.md                 ← when to use which
```

Register them in `slides/index.ts`:

```ts
{
    id: 'problem',
    title: 'Problem',
    component: ProblemSlide,
    defaultVariant: 'default',
    variants: {
        default: { label: 'Quadrants', component: ProblemSlide },
        'monday-morning': { label: 'Monday morning', component: ProblemMondayMorningVariant },
    },
    context: { /* ... */ },
}
```

When adding a variant, append a section to `<slide-id>-variants/options.notes.md` describing when this variant lands hardest.

## Per-slide controls (LOCAL panel)

Slides that need live-tunable widgets (sliders, axis pickers, mock-data toggles) can ship a `controls` component:

```ts
{
    id: 'landscape',
    title: 'Why We Win',
    component: LandscapeSlide,
    controls: LandscapeControls,
    context: { /* ... */ },
}
```

The viewer renders `controls` in a yellow-bordered LOCAL panel top-right. **The panel only renders when `process.env.NODE_ENV !== 'production'`** — production builds and exports never see it. Use this for authoring-only widgets that would be noise to investors.

## Companion docs

Every deck folder should ship two markdown files:

- `DECK.md` — design principles, slide plan, hard rules. Edit when the deck's structure changes.
- `REFERENCES.md` — citation table for external claims. Edit when you add or change a numbered claim.

`seed-2026/DECK.md` and `seed-2026/REFERENCES.md` are the worked examples.

## The 1280×720 design canvas (guard rail)

Every slide is rendered into a fixed **1280 × 720** canvas and CSS-scaled to fit the viewport. The constants live in `components/decks/deck-viewer.tsx` as `SLIDE_DESIGN_WIDTH` / `SLIDE_DESIGN_HEIGHT`, and every view mode (card / full / grid / scroll / mobile / thumbnails) goes through the shared `ScaledStage`.

Practical rules:

- **Author against 1280×720.** Use Tailwind's pixel-based sizes (`text-8xl`, `px-24`, `max-w-5xl`) without worrying about responsive breakpoints inside the slide. The viewer handles scaling.
- **Don't add `sm:` / `md:` / `lg:` prefixes inside slide components.** A slide laid out at desktop sizes will render correctly on a phone — same layout, smaller scale. Responsive breakpoints inside a slide will only fire at the *unscaled* design size, which never changes, so they're noise.
- **Don't rely on `100vh` / `100vw` inside a slide.** Those refer to the real viewport, not the slide canvas. Use `h-full` / `w-full` (which take the canvas size).
- **The `mobile` view mode** is a desktop preview: it renders the slide inside a portrait-iPhone bezel as a 16:9 strip, exactly the way an investor on a real phone (in card view) sees it. Use it before shipping a slide change to sanity-check that nothing is unreadable at small scale.

## Hotkeys

`→/↓/Space` next · `←/↑` prev · `V` toggle card/full · `G` grid · `S` scroll · `P` mobile preview · `F` fullscreen · `M` manager · `C` context · `Esc` close panels.

## Persistence

Per-deck localStorage keys: `deck_<id>_enabled_slides`, `deck_<id>_slide_order`, `deck_<id>_view_mode`, `deck_<id>_variant_choices`. URL params (`?slide=`, `?view=`, `?variant=`) override on first load and write back on change.

Never persist the current slide index — investors expect every fresh visit to start at slide 1. The only way to land deep is via `?slide=`.

## Adding a deck

1. Create `components/decks/<deck-id>/slides/index.ts` exporting `SLIDES: SlideDefinition[]`.
2. Add an entry to `DECKS` in `components/decks/index.ts` with `id`, `title`, `description`, `slides`, optional `pdfFilename`, `contact`, `logoUrl`, and `chrome`.
3. Grant access by adding the deck id to a credential's `accessTo` array in `lib/investors/credentials.server.ts` (or use `'*'`).
4. Ship `DECK.md` and `REFERENCES.md` alongside the slides.

## What NOT to do

- Don't import `SlideDefinition` from `seed-2026/slides` — always from `components/decks/types`.
- Don't hardcode deck chrome into slide components when it belongs in `deck.chrome`. Top-left brand and top-right slide number should stay configurable at the deck definition level.
- Don't add analytics or telemetry hooks. Users add their own provider in forks.
- Don't claim a slide has a context update without updating `context.nailsThis` to match.
- Don't put credentials, the session secret, or the allowlist in client code.
- Don't use `html2canvas` (the original) — it doesn't support `oklch`. Use `html2canvas-pro`.

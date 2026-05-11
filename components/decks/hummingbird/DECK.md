# Hummingbird — Seed 2026 — Deck principles & slide plan

The companion design doc for this deck. Every slide in `slides/` is bound by these rules. When editing a slide component, update the matching `context` field in `slides/index.ts` so the in-deck `SlideContextWidget` stays correct.

## Format

YC pitch deck. **7 slides.** Land in 5–7 minutes. 30pt minimum body font.

## Hard rules

1. **30pt font rule.** `text-lg` minimum for body, `text-4xl`+ for headlines. No `text-xs`/`text-sm` for slide body — only labels and badges.
2. **Slide-count rule.** 7 slides. The deck does not earn an 8th slide without cutting one.
3. **Live where it matters.** Traction MRR reads from Stripe via `/api/stripe-mrr`; static fallback when `STRIPE_KEY` is unset. The Live/Static badge tells the audience which they are looking at.
4. **Headline-as-resolution.** The Solution headline names the artifact from the Problem slide. The Demo headline reinforces the 60-second claim.
5. **No screenshots in the demo.** The Demo slide is a real code block, not an image of one. If we change the API, the slide changes too.
6. **AI editing rule.** When you edit a slide component, update `context.nailsThis`, `context.goals`, `context.whatItIsNot`, and `context.storyThread` in `slides/index.ts` to match.

## Slide plan

| # | ID | Title | Goal |
| --- | --- | --- | --- |
| 1 | `title` | Title | Hummingbird, the wedge, founders, in five seconds. |
| 2 | `problem` | Problem | Four costs of indie-Stripe-wiring as numbers. |
| 3 | `solution` | Solution | One CLI command + hosted webhook + portal. |
| 4 | `demo` | Demo | A 3-line `billing.ts` config. |
| 5 | `traction` | Traction | Live MRR + WAU + MoM growth + TTFC. |
| 6 | `team` | Team | Two ex-Stripe engineers (Connect, Tax). |
| 7 | `ask` | The Ask | $2M seed at $14M post, 24mo runway. |

## Live data

The Traction slide's headline MRR figure is a Server Component fetch through `lib/hummingbird/stripe-mrr.ts` (also exposed as `/api/stripe-mrr`). The fetch is cached for 5 minutes via `next: { revalidate: 300 }`.

When `STRIPE_KEY` is unset, the helper returns `null` and the slide falls back to the static `$48K` headline with a "Static" badge instead of "Live". This means the deck always renders, even on a fresh clone with no env vars.

For local dev: set `STRIPE_KEY=sk_test_…` in `.env.local`. Use a restricted key (read-only on subscriptions) — the helper only ever calls `GET /v1/subscriptions`.

## Adding a slide

1. Create `slides/<id>-slide.tsx`.
2. Add an entry to `SLIDES` in `slides/index.ts` with a populated `context` object.
3. Update the table above.
4. Add any external claims to `REFERENCES.md`.

# Seed 2026 — Deck principles & slide plan

The companion design doc for this deck. Every slide in `slides/` is bound by these rules. When editing a slide component, update the matching `context` field in `slides/index.ts` so the in-deck `SlideContextWidget` stays correct.

## Format

YC pitch deck. **11 slides.** Land in 10–13 minutes. 30pt minimum body font.

## Hard rules

1. **30pt font rule (Kawasaki).** In Tailwind that's `text-lg` minimum for body, `text-4xl`+ for headlines. Never `text-xs`/`text-sm` for slide body — only footnotes and labels.
2. **Slide-count rule.** 10–15 is YC's actual range. This deck is 11. Don't drift past 12 without cutting something.
3. **Positioning rule.** Never claim "we're the best." Show the empty quadrant.
4. **Headline-as-resolution.** Every Solution-side slide's headline names the artifact from the previous slide and adds a resolution verb.
5. **Visual-as-headline.** If the visual carries the message, kill the body copy.
6. **TAM math, not analyst reports.** Market slide leads with `customers × price = revenue` the investor can recompute in their head.
7. **Funnel as evidence.** Traction shows progression (signups → activated → weekly-active → paid), not point-in-time MRR.
8. **AI editing rule.** When you edit a slide component, update `context.nailsThis`, `context.goals`, `context.whatItIsNot`, and `context.storyThread` in `slides/index.ts` to match. The widget is the live source-of-truth for "why is this slide here."

## Slide plan

| # | ID | Title | Goal |
| --- | --- | --- | --- |
| 1 | `title` | Title | Who, what, when in 5 seconds. |
| 2 | `problem` | Problem | Four named costs of static decks. |
| 3 | `solution` | Solution | Resolution to each cost, in order. |
| 4 | `why-now` | Why Now | Three external shifts that opened the door. |
| 5 | `product` | Product | One feature per Problem-cost + variant/access primitives. |
| 6 | `market` | Market | Bottom-up sizing, recomputable live. |
| 7 | `traction` | Traction | Funnel as evidence of momentum. |
| 8 | `landscape` | Why We Win | Empty-quadrant positioning vs. existing tools. |
| 9 | `business-model` | Business Model | OSS distribution, paid hosted capture. |
| 10 | `team` | Team | Earned secret + verb-per-founder. |
| 11 | `ask` | Ask | Cheque, 18-month milestones, next round. |

## Variants in play

- **`problem`** — three live variants: `default` (quadrants), `monday-morning` (timeline), `three-truths` (declarative). Pick by audience read in the room. See `slides/problem-variants/options.notes.md` for usage notes.

## Adding a slide

1. Create `slides/<id>-slide.tsx`.
2. Add an entry to `SLIDES` in `slides/index.ts` with a populated `context` object.
3. Update the table above.
4. Add any external claims to `REFERENCES.md`.

## Adding a variant

1. Create `slides/<slide-id>-variants/<variant-name>.tsx`.
2. Register under `variants` in the slide's registry entry. Set `defaultVariant` if you want the new variant as the default.
3. Add notes to `slides/<slide-id>-variants/options.notes.md`.

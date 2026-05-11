# NoPoint — Due Diligence companion deck (stub)

A parallel deck to `seed-2026` (the simplified pitch). Same 11 slide IDs, but each slide reserves space for the deeper version a partner reads after a positive first meeting.

**Status: stub.** Every slide currently renders a `DuedilStubSlide` placeholder listing what the real content should cover. Fill these in *before* sending the deck to a partner — never send the stubs.

## Format

11 slides matching the pitch deck. Body text 30pt minimum. Per-section chapter numbering (00.x, 01.x, …) so the document survives being printed.

## Hard rules

1. **Memorandum, not pitch.** Numbers and assumptions, not aspirational copy.
2. **Every claim needs a citation in `REFERENCES.md`.** Partners' diligence teams will check.
3. **Each slide expands the matching pitch-deck slide.** Don't introduce new threads — go deeper on the same ones.
4. **Bands over forecasts.** Financial slides show best/base/worst, not single lines.

## Slide-to-pitch map

| # | ID | Pitch slide | Deeper goal |
| --- | --- | --- | --- |
| 1 | `title` | Title | Reframe as memorandum + confidentiality. |
| 2 | `problem` | Problem | Customer quotes + cost-per-persona + incumbent failure. |
| 3 | `solution` | Solution | Annotated user flow + Problem-to-feature map + non-goals. |
| 4 | `why-now` | Why Now | Dated shifts with public sources + addressable window. |
| 5 | `product` | Product | Architecture + roadmap + scaling plan. |
| 6 | `market` | Market | Bottom-up TAM/SAM/SOM + segments + access paths. |
| 7 | `traction` | Traction | Funnel cohorts + named customers + 90-day pipeline. |
| 8 | `landscape` | Why We Win | 2x2 + defensibility + incumbent-copies-us scenario. |
| 9 | `business-model` | Business Model | Tiered pricing + CAC/LTV/payback per tier. |
| 10 | `team` | Team | Founder bios + 12-month hiring plan + advisors. |
| 11 | `ask` | Ask | Round details + use-of-funds + diligence checklist + data-room. |

## When to use

Send this deck after a successful first meeting, when a partner asks for "more detail" or when scheduling an investment-committee briefing. **Don't send it cold** — the pitch deck does the cold-send work.

## Adapting

Replace each `DuedilStubSlide` with a real component:

1. Create `components/decks/nopoint-duedil/slides/<id>-slide.tsx`.
2. Update the matching entry in `slides/index.ts` — replace the `component` function with the real one.
3. Update `context.nailsThis`, `context.goals`, `context.whatItIsNot`, `context.storyThread` to match the new content honestly.
4. Add any new claims to `REFERENCES.md`.

For slides that need a long-form chapter rather than a single screen, split into multiple slides — the slide manager (M) lets investors page through them in order.

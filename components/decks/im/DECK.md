# Information Memorandum template — Deck principles

Long-form deep-dive document used post-pitch. Read by partners preparing for an investment committee. ~30 slides; not all will be presented live.

## Format

30 slides organised into 11 sections. Body text 30pt minimum. Per-section chapter numbering (00.x, 01.x, ...) so it survives being printed.

## Hard rules

1. **Memorandum, not pitch.** Numbers and assumptions, not aspirational copy.
2. **Every claim needs a citation in `REFERENCES.md`.** No exceptions; partners' diligence teams will check.
3. **Bands over forecasts.** The Financials projection slides show best/base/worst, not a single line.
4. **Each section ends with the question that opens the next.** Story thread carries through.

## Section map

| Section | Chapter range | Slides |
| --- | --- | --- |
| Front Matter | 00.x | 3 |
| Problem & Solution | 01.x | 3 |
| Market | 02.x | 3 |
| Product | 03.x | 3 |
| Go-to-Market | 04.x | 2 |
| Traction | 05.x | 3 |
| Business Model | 06.x | 2 |
| Competition | 07.x | 2 |
| Team | 08.x | 3 |
| Financials | 09.x | 3 |
| Risk & Compliance | 10.x | 2 |
| The Ask | 11.x | 2 |

Total: 31 slides.

## Adapting

This template ships as 31 placeholder slides driven by `SectionSlide` and a `SPECS` array in `slides/index.ts`. To turn a stub into a real slide:

1. Replace the placeholder `component` field with a custom component.
2. Keep the section + chapter labels for navigation continuity.
3. Update `context.nailsThis`, `context.goals`, `context.whatItIsNot`, and `context.storyThread` so the in-deck widget stays correct.

## When to use

Send the IM after a successful first meeting, when a partner asks for "more detail" or when scheduling an investment-committee briefing. Don't send it cold — the pitch deck does the cold-send work.

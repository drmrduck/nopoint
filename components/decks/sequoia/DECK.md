# Sequoia template — Deck principles

Sequoia's "writing a business plan" framework, reduced to 10 slides. Use this when the audience is institutional, late-Series-A onwards, or any partner who reads `Sequoia Capital`'s "writing a business plan" guide before the meeting.

## Format

10 slides. ~15 minutes. Body text 30pt minimum.

## Hard rules

1. Every slide answers one question and only one.
2. The Company Purpose sentence is the seed of the whole deck. If you can't make it both narrow and ambitious, you are not ready.
3. Competition slide must show the empty quadrant. Never "we are the best."
4. Market sizing must be bottom-up and recomputable from public data.

## Slide plan

| # | ID | Question it answers |
| --- | --- | --- |
| 1 | `company-purpose` | Define the company in one sentence. |
| 2 | `problem` | Whose life is bad today, and why? |
| 3 | `solution` | How do you fix it? |
| 4 | `why-now` | Why is this possible only now? |
| 5 | `market-size` | How big is the pool? |
| 6 | `competition` | Who else is fishing in it? |
| 7 | `product` | How does the product earn its quadrant? |
| 8 | `business-model` | How does money flow? |
| 9 | `team` | Why this team, specifically? |
| 10 | `financials` | Round size, milestones, runway. |

## Adapting

This template ships as 10 placeholder slides. Replace each one's `component` field in `slides/index.ts` with a real slide. Keep `context.nailsThis`, `context.goals`, `context.whatItIsNot`, and `context.storyThread` updated as you go — the in-deck `SlideContextWidget` reads them.

# Hummingbird — References

Every external claim or number in the deck, with a citation. Update this whenever you add or change a numbered claim in any slide.

| # | Slide | Claim | Source / status |
| --- | --- | --- | --- |
| 1 | `problem` | Indie founders lose ~2 weeks wiring Stripe after a weekend ship. | **Internal estimate** — based on founder interviews (n=12, Q1 2026). Replace with a citable figure before institutional pitches. |
| 2 | `problem` | 60% of indie founders never re-engage payment work after launch. | **Internal estimate** — same interview cohort as above. Soft number; reframe or cite before institutional use. |
| 3 | `traction` | $48K MRR (static fallback). | **Static fallback only.** Live value comes from Stripe via `/api/stripe-mrr` when `STRIPE_KEY` is set. |
| 4 | `traction` | 4,200 weekly active devs. | **Internal analytics** — fill source (PostHog / Plausible / etc.) before sending the deck out. |
| 5 | `traction` | 14% MoM growth over 4 months. | **Internal analytics** — cite the reporting period explicitly when this slide ships. |
| 6 | `traction` | 60s median time-to-first-charge. | **Internal SDK telemetry** — replace with the source when known. |
| 7 | `team` | Jamie was on Stripe Connect. | Founder bio. |
| 8 | `team` | Sam was on Stripe Tax. | Founder bio. |
| 9 | `ask` | $2M seed at $14M post. | Round terms (current). |

## Update protocol

- When a number changes in a slide, update the row here in the same commit.
- When a number is internal-only (e.g. founder interviews), say so explicitly. Do not let internal estimates drift into the deck as "industry data."
- Before any institutional pitch, walk this table and confirm every "Internal estimate" row is either replaced with a citable source or stripped from the slide.

# Problem slide — variant notes

Live variants for the Problem slide. Pick whichever lands hardest with the audience in the room.

## `default` — four-quadrant grid

The cards-and-headlines layout. Reliable; works for warm intros where you don't yet know which edge to lean into.

## `monday-morning` — narrative timestamp

A timeline of one bad Monday in 4 messages. Concrete, emotionally specific. Best for founder-friendly funds who want to see the felt pain.

## `three-truths` — declarative

Three numbered claims, each its own line. Best for late-stage / process-heavy investors who want the abstraction up front before the colour.

## `stale-numbers` — copy-paste / live-data pain

A timestamped night-before-pitch grind: MRR copy-pasted from Stripe, cohort screenshots from Mixpanel, funnels exported from BigQuery — all stale the moment you hit "export PDF". Closes with the npm hint: every fact is one `import` away, and PowerPoint can't reach any of it. Best for technical/product-led investors who'll immediately grok the "your deck is a React app with the full npm registry behind it" angle. Pairs well with showing the Solution slide's "Pipe it" verb.

---

Add a new variant by dropping a `.tsx` file into this directory and registering it in `../slides/index.ts` under the `variants` field of the `problem` slide.

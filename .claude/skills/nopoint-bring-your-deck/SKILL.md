---
name: nopoint-bring-your-deck
description: Bootstrap the nopoint repo locally and import an existing pitch deck (PDF, PPTX, Keynote, Google Slides, or screenshots) into it as React-component slides, wire live data (Chartcastr embed or a custom API route with an API key), and ship it to the user's own domain. Use this whenever the user is in or about to clone the nopoint repo and asks to "set up nopoint", "import my deck", "convert my pitch deck", "migrate slides into nopoint", "rebuild this PDF as React slides", "wire Stripe / GA / CRM data into a slide", "add a Chartcastr chart", "deploy nopoint to my own domain", "publish on pitch.<their-domain>", "embed nopoint slides in my existing app", or otherwise wants to go from a finished deck file to a live, branded deployment. Trigger even when the user only describes the goal ("get my Series A deck running here") without naming the steps.
---

# Bring your deck to nopoint

This skill walks a user from "I have a deck and a clone of nopoint" to "my deck runs in the viewer with live data." It assumes they want to keep their content but rebuild it on top of the nopoint runtime.

The repo's `README.md` and `AGENTS.md` are the source of truth for conventions. Read both before you start writing code — they document breaking-change conventions for this fork of Next.js and the slide context contract that authoring relies on. This skill exists to choreograph the *workflow*, not to duplicate that reference material.

## When to use this skill

Trigger any time the user is trying to onboard a deck into this repo. Common shapes:

- They've just cloned nopoint and pasted (or attached) their existing deck.
- They have a draft of slides in PDF / PPTX / Keynote / Google Slides and want them rebuilt as code.
- They mention "live data in a slide" and need a steer toward Chartcastr or a custom API route.
- They ask to set up the dev server or fork one of the templates.

If the user only wants to edit *existing* slides in the repo, you don't need this skill — `AGENTS.md` covers that.

## The shape of the workflow

There are three phases. Do them in order. Don't skip to phase 2 until the dev server is up, because you'll want to eyeball each slide as you build it.

1. **Bootstrap** — clone (if needed), install, run, sign in.
2. **Import the deck** — fork a template, rebuild slides one at a time, register the new deck.
3. **Wire data** — only if the user actually needs live numbers. Most decks don't on day one.

## Phase 1 — bootstrap

If the user hasn't cloned the repo yet, run the steps from `README.md` § "Get started in 60 seconds". Default to `bun`; fall back to `npm` if `bun` isn't on the path.

```bash
git clone https://github.com/drmrduck/nopoint.git nopoint
cd nopoint
bun install        # or: npm install
cp .env.local.example .env.local
bun dev            # runs in the background; tails on http://localhost:6829
```

The dev server should keep running in the background while you work. Once it's up:

- Visit `/investors/login` and use one of the dev credentials shown on the login page.
- Browse `/investors/decks/seed-2026` so you've seen what a "finished" deck looks like before you start editing.
- Open `AGENTS.md` and read the **slide context contract** and **1280×720 design canvas** sections. These two contracts cause the most rework if you skip them.

Don't add any env vars yet. Production needs `INVESTOR_SESSION_SECRET`; nothing in the import workflow does. See "Going live on your own domain" below for `NEXT_PUBLIC_SITE_URL` — set that when you're ready to ship, not before.

## Phase 2 — import the user's deck

### Step 2a. Get the source material in front of you

The repo intentionally has no PDF/PPTX importer — the right move is to **read the source deck and rebuild each slide as a React component**, not to write a converter. To do that you need to actually see the slides.

How to receive the source depends on what the user has:

- **PDF / PPTX / Keynote export** — ask the user to attach the file directly to chat. You can read the pages and copy text/structure straight off them.
- **Google Slides** — ask for a "File → Download → PDF" export, then attach.
- **Locked source (Figma, locked Keynote)** — ask for one screenshot per slide.
- **Just a Notion / doc outline** — that's fine too; treat it as a content brief.

If you can't see the slides, stop and ask. Guessing at content from a filename produces decks the user has to throw away.

### Step 2b. Pick a starting template (fork its shape, not its content)

Fork the closest template under `components/decks/` rather than starting from scratch:

| Source deck | Best fork base | Why |
| --- | --- | --- |
| YC-style ~10 slides, founder pitch | `seed-2026/` | Real pitch deck, modern stack, Chartcastr already wired in places. |
| Sequoia narrative (Why now / Market / Team / Product / Business model) | `sequoia/` | 10 placeholder slides already named after the framework. |
| Long-form diligence pack (~30 slides) | `im/` | Information-Memorandum scaffold, dense layouts. |
| Recreating a famous deck for inspiration | `airbnb/` or `buffer/` | Period-correct visual systems, useful style references. |

You have two ways to fork. Pick based on how content-heavy the template is:

**Option A — `cp -R` and edit in place.** Good when the template is mostly placeholders (`sequoia/`, `im/`).

```bash
cp -R components/decks/sequoia components/decks/<your-deck-id>
```

**Option B — author fresh files against the template's *shape*.** Better when the template is content-rich (`seed-2026/`, `airbnb/`, `buffer/`). Read each template slide, lift the layout primitives that work (padding scale, headline size, grid structure, motion), but write the JSX from scratch with the user's content. You'll write a little more code; you'll delete a lot less stale content. The output is also easier to reason about because nothing is left over from a different pitch.

Either way, `<your-deck-id>` should be lowercase, hyphenated, and stable — it ends up in URLs and localStorage keys.

**Pick a single accent colour up front.** seed-2026 is blue; rr-diner is red; chartpasta is amber; airbnb is Rausch red; buffer is Buffer-blue. Pick something tied to the user's brand or product (Stripe-adjacent → emerald, fintech → indigo, etc.) and use it consistently across all slides instead of mixing palettes.

### Step 2c. Rewrite the slides

Work through the user's deck **one slide at a time**, in order. For each one:

1. Open the matching template slide in `components/decks/<your-deck-id>/slides/`.
2. Replace the content with the user's, keeping the layout primitives that already work (typography sizes, grid, motion).
3. Update the slide's `context` block in `slides/index.ts` honestly — at minimum `nailsThis` and `storyThread` (and `goals` / `whatItIsNot` if you can). The `SlideContextWidget` (hotkey `C`) reads these live and is the source of truth for *why* the slide exists. If you can't honestly fill these in, flag the slide to the user — it usually means the source deck has an unclear slide that's worth rethinking before rebuilding.
4. Save, then refresh the browser and check the slide in **card view** (`V`) and **mobile preview** (`P`). The 1280×720 canvas scales down, so anything unreadable on the iPhone bezel is a real problem on a real phone.

Hard rules pulled from `AGENTS.md` — keep them in the front of your mind while editing:

- **Author against 1280×720.** Use Tailwind pixel sizes (`text-8xl`, `px-24`). The viewer scales the whole canvas; you do not handle responsiveness inside a slide.
- **Don't use `sm:` / `md:` / `lg:` prefixes inside a slide.** They only fire at the unscaled design size, which never changes — they're dead code at best, layout bugs at worst.
- **Don't use `100vh` / `100vw` inside a slide.** Use `h-full` / `w-full`, which fill the canvas.
- **Import `SlideDefinition` from `components/decks/types`**, not from any individual deck folder.
- **Use `html2canvas-pro`, not `html2canvas`.** The original doesn't support `oklch`, which is everywhere in Tailwind 4.
- **Async Server Components are valid slide components.** `SlideDefinition.component` is `ComponentType`, which the App Router happily accepts an `async function` for. You only need a client component (`'use client'`) when the slide has interactive state or browser-only effects.

### Step 2d. Register the deck

Open `components/decks/index.ts` and append the new deck to `DECK_REGISTRY` near the bottom of the array. Mirror the shape of `seed-2026`:

```ts
import { SLIDES as MY_DECK } from './<your-deck-id>/slides'

// inside DECK_REGISTRY:
{
    id: '<your-deck-id>',
    title: 'My Deck',
    description: 'One sentence the investor sees in the deck-library card.',
    slides: MY_DECK,
    pdfFilename: 'my-deck.pdf',
    contact: { email: 'you@example.com' },
    chrome: {
        brand: { kind: 'text', text: 'My Deck', className: 'text-[11px] font-bold uppercase tracking-[0.32em] text-white/40' },
    },
},
```

**Critical — grant access, or the deck will 404.** A registered deck without an entry in either the credential allowlist or the public list is invisible to the portal. Don't skip this.

- **Gated (default)** — edit `lib/investors/credentials.server.ts` and add the deck id to a credential's `accessTo` array (or use `'*'` to grant all decks). For initial dev, the seeded `demo@…` credential is the easiest target.
- **Public** — add the id to `PUBLIC_DECK_IDS` in `lib/decks/visibility.ts`. Confirm with the user before making a deck public — that decision is hard to undo once the link is out.

### Step 2e. Ship the companion docs

Each deck folder is expected to ship two markdown files. Don't skip these for "real" decks — they're how the user (and future-you) keep the deck honest.

- `DECK.md` — design principles, slide plan, hard rules. The "why" of the deck.
- `REFERENCES.md` — every external claim or number that appears in a slide, with a citation. Run through this before any institutional pitch.

`components/decks/seed-2026/DECK.md` and `REFERENCES.md` are worked examples. Always copy these two files when you fork a template — start from a populated structure, not a blank page.

**Flag soft numbers as soft.** If the user gave you a number off the cuff ("we're at like 4k weekly users"), do not ship it as a citation-shaped fact. In `REFERENCES.md`, give it a row with source = "founder estimate, internal" and a TODO to confirm before any institutional pitch. The citation table is also where future-you (and any partner reviewer) will catch a number that drifted from reality, so the metadata is load-bearing.

## Phase 3 — wire data into a slide

Skip this phase entirely unless the user has a specific number that should change without them touching the deck. Most pitches don't need it on day one — a static `text-9xl font-bold` revenue number is fine until it isn't.

**Universal rule: live-data slides must degrade to a static fallback.** A fresh clone of the repo without the user's secrets in `.env.local` should still render every slide in the deck. That means: if the upstream call fails or the API key isn't set, return `null` from the data layer and have the slide render the last-known number with a "Static" badge instead of the live one. A slide that crashes (or shows `$0`) on a missing env var is worse than one that silently shows a stale number — the export pipeline will capture the broken state into the PDF.

There are two paths. Pick one per chart, based on what the user already has.

### Path A — Chartcastr (preferred for live metrics + AI commentary)

Use this when the user's data already lives somewhere Chartcastr can reach (Stripe, Google Analytics, Postgres, a warehouse, a CRM) and they want a managed embed that auto-refreshes and ships AI-generated board-style commentary.

1. Get an API key from [chartcastr.com/admin/settings/api-keys](https://chartcastr.com/admin/settings/api-keys).
2. Add it to `.env.local`:

   ```bash
   CHARTCASTR_API_KEY=ak_…
   ```

   The key never reaches the client — the server-side proxy at `app/api/chartcastr/[sourceId]/route.ts` forwards requests with the key attached.
3. Use `<ChartcastrSource sourceId="…" />` from `components/decks/chartcastr-source.tsx` in the slide. Find a `sourceId` in the Chartcastr admin.
4. (Optional) Add the source id to the slide's `chartcastrSourceIds` array in `slides/index.ts` — the deck viewer prefetches those on mount, so the chart renders instantly when the slide is reached.

### Path B — custom API route (full control, any data source)

Use this when the data lives somewhere weird (an internal API, an unsupported SaaS, a CSV in S3), or when the user wants raw control over the rendering.

1. **Create a server route** at `app/api/<source>/route.ts`. Read keys from non-`NEXT_PUBLIC_` env vars so they stay server-side. Set `next: { revalidate: <seconds> }` on the upstream `fetch` so the API isn't hammered on every render.

   ```ts
   // app/api/stripe-mrr/route.ts
   export async function GET() {
       const r = await fetch('https://api.stripe.com/v1/...', {
           headers: { Authorization: `Bearer ${process.env.STRIPE_KEY}` },
           next: { revalidate: 300 },
       })
       const data = await r.json()
       return Response.json({ mrr: data.mrr })
   }
   ```

2. **Fetch from the slide.** Prefer a Server Component (no client JS) for data that's fine being a few minutes stale. Use `useEffect` + `fetch` only when the slide truly needs to poll while open.

   ```tsx
   export async function MrrSlide() {
       const { mrr } = await fetch('http://localhost:6829/api/stripe-mrr').then(r => r.json())
       return <div className="text-9xl font-bold">${mrr.toLocaleString()}</div>
   }
   ```

3. **Render it however the slide needs** — Recharts, Tremor, raw SVG, a `<table>`. Slides are React components; nothing about them is special.

A worked example for the most common case (Stripe MRR): Stripe doesn't expose MRR as a single field, so the helper sums `subscription.items` for active subscriptions, normalising each item to monthly cents based on its interval. Don't reach for `GET /v1/balance` — that's last-30-day collected revenue, not MRR. Cache the response with `next: { revalidate: 300 }` so you're not pinging Stripe per page view.

After wiring the route, re-confirm in the browser that the value is correct and that the export pipeline still captures a clean visual (the export path uses `html2canvas-pro` to snapshot whatever the live DOM shows — see the note on export shape below for what "clean" means here).

## Sanity-check before reporting done

For any deck you've imported:

- Open it in the viewer at `/investors/decks/<your-deck-id>`.
- Walk every slide in **card** view, then again in **mobile preview** (`P`). Anything unreadable on the bezel is a real problem.
- Try **export → PDF** and **export → PPTX** from the viewer menu. Both should render without missing fonts or chopped layouts (see "What the exports actually are" below — these are visual snapshots, not editable slides). Open the PPTX in Google Slides as a final sanity check — that's where most investors will end up viewing the file.
- Open the **SlideContextWidget** (`C`) on each slide and read it back. If `nailsThis` doesn't sound true, fix the slide or fix the description; don't ship a slide whose own widget contradicts it.

If anything fails any of those checks, fix it before telling the user it's done. The viewer and the export pipeline are the user's actual surface — passing typecheck doesn't mean the deck looks right.

## If you can't see the browser (autonomous agent mode)

Several steps in this skill assume a human at the dev server, refreshing between slide edits and pressing `C` / `P` / `V` to inspect. If you're running this autonomously and can't drive the browser, adapt:

- **Don't loop back to "refresh and check" between slides.** Author all the slides in one pass.
- **Verify what you can without rendering.** Run `bunx tsc --noEmit` after each major batch of edits to catch type-level breakage early. Grep for the deck id in `index.ts` and the credentials file to confirm registration and access.
- **Honestly fill in `context.nailsThis` and `context.storyThread` for every slide as you write it.** You can't open the SlideContextWidget to verify visually, so the only protection against drift is writing them honestly the first time. If you can't write an honest line, that's a signal the slide isn't doing its job — flag it back to the user instead of papering over it.
- **End with a verification checklist for the user**, not a "looks good" claim. The checklist should include: sign in at `/investors/login`, walk every slide in card view (`V`) and mobile preview (`P`), open the context widget (`C`) on slides where you weren't sure, set any env vars listed in DECK.md, and try export → PDF / PPTX before sending the deck out.

This isn't a downgrade — it's the right shape for the agent context. The user gets a deck and a precise list of what needs eyes; you don't pretend you saw something you didn't.

## What the exports actually are (set expectations honestly)

The PDF / PNG / PPTX exports are **visual snapshots**, not editable slide files. Each slide is rendered in the browser, captured as a PNG via `html2canvas-pro`, and then either stitched into a PDF (jsPDF) or stuffed into a `.pptx` wrapper (pptxgenjs). Investors can open the file in PowerPoint or Google Slides and view it; they cannot click into a text box and edit the headline. There are no editable text boxes, smart layouts, or PowerPoint shape primitives — just images on slides.

That has three consequences worth telling the user up front:

1. **The source of truth stays the React code.** Changes happen in `components/decks/<deck-id>/slides/`, not in the exported file. Investors who edit the PPTX are editing a screenshot wrapper that won't flow back into the repo.
2. **Re-export, don't patch.** When a number changes, fix it in code and export again. Don't hand-edit the PPTX — the next export will overwrite that edit and the deck will drift between code and PPTX.
3. **The file size is meaningful.** A 30-slide PPTX is 30 PNGs at retina resolution — usually 8–40 MB. If a fund's portal rejects files over 25 MB, drop export resolution (the `scale:` option on `html2canvas-pro`) or ship a PDF instead.

If the user says "I want to edit the deck in PowerPoint after exporting" — that's not what this tool does. The closest workflow is: edit a slide in code (one line change, AI-assisted), re-export, resend. Don't promise PowerPoint round-trip editing.

## Going live on your own domain

nopoint is OSS — every fork ships under its own brand, on its own host. Whether the user is deploying to `pitch.theircompany.com`, `series-a.acme.io`, a private subdomain, or embedding the runtime inside another app, the canonical URL has to follow the deployment. The default fallback points at the upstream `nopoint.app` demo so a fresh clone still renders cleanly — leaving it that way in production breaks SEO and OG previews.

When the user is ready to publish (not before — this is unnecessary noise during the import phase):

1. **Pick the canonical origin.** Whatever the investor types or pastes — `https://pitch.theircompany.com`. No trailing slash, https only. If they're attaching multiple domains (e.g. a vanity domain + the `*.vercel.app` URL), pick the one they want investors to see in shared links and in Google.

2. **Set `NEXT_PUBLIC_SITE_URL`** in `.env.local` for dev and in the hosting provider's env settings for prod:

   ```bash
   NEXT_PUBLIC_SITE_URL=https://pitch.theircompany.com
   ```

   On Vercel: Project → Settings → Environment Variables → add for Production (and Preview if you want preview deployments to advertise themselves as the prod URL — usually you don't). On other hosts, set it before the build runs — `NEXT_PUBLIC_*` is inlined at build time, not read at request time. `VERCEL_PROJECT_PRODUCTION_URL` is the automatic fallback when this is unset, but it only resolves to the `*.vercel.app` URL — once a custom domain is attached, set this explicitly.

3. **Confirm the canonical flowed through.** Hit the live site and view-source on `/`. You should see exactly one `<link rel="canonical" href="https://pitch.theircompany.com/">` and the OG tags should resolve to that origin. Then check `https://pitch.theircompany.com/sitemap.xml` and `/robots.txt` — every URL inside should be under the new origin. If any of these still say `nopoint.app`, the env var didn't make it into the build.

4. **Multi-domain deployments are fine** — point as many domains as needed at the same deployment (a vanity domain and a fallback subdomain, for instance). Both render. The `NEXT_PUBLIC_SITE_URL` value picks the canonical for SEO; the others rel-canonical to it automatically because `metadataBase` resolves all per-page `alternates.canonical` relative paths against this origin. You don't need a redirect unless the user actively wants one.

5. **Embedding inside another app.** If the user is mounting nopoint slides inside an existing site (e.g. an `<iframe>` of `/investors/decks/<id>` on a marketing page they already own), the canonical URL should still be the nopoint deployment's own origin — `NEXT_PUBLIC_SITE_URL` of the nopoint deployment, not the parent site. The parent page's own SEO is owned by the parent, not by nopoint.

Everywhere the old hardcoded URL used to appear — `metadataBase`, `sitemap.xml`, `robots.txt`, OG image text, JSON-LD, share-link SSR fallback — now reads from `lib/site.ts` and resolves to `NEXT_PUBLIC_SITE_URL`. If a fork adds a new SEO surface, route it through `SITE_URL` from `@/lib/site` rather than hardcoding a host.

## What this skill is not

- It is **not** a converter that auto-imports a PDF into React. The right shape of each slide is a judgment call; rebuild deliberately.
- It is **not** for editing slides that already exist in the repo — for that, follow `AGENTS.md` directly.
- It is **not** for changing deck infrastructure (auth, exports, the viewer itself). Treat those as out of scope and flag them back to the user if they come up mid-import.

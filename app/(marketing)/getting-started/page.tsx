import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, ExternalLink, FileText, GitBranch, Globe, Image as ImageIcon, Plug, Rocket, Sparkles, Terminal, Upload } from 'lucide-react'
import { DECKS } from '@/components/decks'
import { CopyPromptButton } from '@/components/getting-started/copy-prompt-button'

export const metadata: Metadata = {
    title: 'Get started — 🛝 NoPoint',
    description:
        'Clone the repo, run it locally, and let Claude Code / Cursor / Codex turn your pitch deck into versioned, programmable slides.',
    alternates: { canonical: '/getting-started' },
    openGraph: {
        title: 'Get started — 🛝 NoPoint',
        description:
            'Clone the repo, run it locally, and let Claude Code / Cursor / Codex turn your pitch deck into versioned, programmable slides.',
        url: '/getting-started',
    },
}

const REPO_URL = 'https://github.com/drmrduck/nopoint'

const IMPORT_PROMPT = `I want to recreate my existing pitch deck in this nopoint repo, slide for slide.

I'll attach the source in this same chat — either:
  • the original file (PDF, PPTX, Keynote export, or a markdown outline), or
  • a screenshot per slide (paste or drag them in, in slide order).

Read whatever I attach. Then:

1. Read AGENTS.md and components/decks/seed-2026/ first — match the SlideDefinition shape, the context field convention, and the 1280×720 design canvas rules.
2. Pick a short slug for my deck (ask me if it's not obvious from the title).
3. Create components/decks/<slug>/ with:
   - slides/index.ts exporting SLIDES: SlideDefinition[]
   - one component per slide under slides/
   - DECK.md (principles, slide plan, hard rules)
   - REFERENCES.md (citation table — leave entries blank where I need to fill them)
4. Register the deck in components/decks/index.ts.
5. Add the slug to a credential's accessTo array in lib/investors/credentials.server.ts.
6. Open http://localhost:6829/investors/decks/<slug> when ready.

Constraints:
- Build it from scratch as React components — don't try to embed the source file. The source is reference material only.
- Lift the deck's voice and structure; don't pad. Keep slide copy tight.
- Author against the 1280×720 design canvas. No sm:/md:/lg: breakpoints inside slide components.
- For each slide, fill context.nailsThis, context.goals, context.whatItIsNot, context.storyThread honestly.
- Stop and ask me before dropping, reordering, or inventing slides.`

const SETUP_PROMPT = `Set up the nopoint deck repo locally and start the dev server. Steps:

1. git clone ${REPO_URL}.git nopoint
2. cd nopoint
3. bun install     (fall back to npm install if bun isn't available)
4. cp .env.local.example .env.local
5. bun dev         (or: npm run dev) — keep it running in the background
6. Open http://localhost:6829 in my browser when the server says it's ready

Then read README.md and AGENTS.md so you have context for what I ask next. Stop and tell me if any step fails — don't fix unrelated issues.`

const TEMPLATE_HINTS: Record<string, { tagline: string; whenToUse: string }> = {
    'seed-2026': {
        tagline: 'YC-style 11-slide pitch',
        whenToUse: 'Founder-led seed raise. Tight, opinionated, story-first.',
    },
    sequoia: {
        tagline: 'Sequoia 10-slide framework',
        whenToUse: 'Classical narrative arc. Good when investors want the canonical shape.',
    },
    buffer: {
        tagline: 'Buffer’s 2013 seed deck',
        whenToUse: 'Traction-led. Real example of a deck that closed $500K in 7 days.',
    },
    airbnb: {
        tagline: 'AirBed&Breakfast 2009',
        whenToUse: 'Early Airbnb deck recreated. Clean, sparse, market-led.',
    },
    chartpasta: {
        tagline: 'Gag deck',
        whenToUse: 'Stress-test the runtime with something irreverent.',
    },
    'rr-diner': {
        tagline: 'Gag deck',
        whenToUse: 'Bright, off-format. Useful for visual experimentation.',
    },
}

function GitHubMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.06 11.06 0 0 1 5.79 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
    )
}

function VercelMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 76 65" fill="currentColor" aria-hidden className={className}>
            <path d="M37.527 0L75.054 65H0L37.527 0z" />
        </svg>
    )
}

function RailwayMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M1.224 14.082c-.018.085-.036.17-.052.255h17.512c1.747 0 3.214-1.214 3.624-2.84H2.092c-.378.81-.667 1.676-.868 2.585zM3.477 9.79h19.566c.012-.085.018-.17.018-.255 0-1.747-1.467-3.213-3.214-3.213H6.69c-1.346 1.012-2.45 2.198-3.213 3.468zM2.075 17.79h17.55c1.748 0 3.214-1.467 3.214-3.214H1.13c.21 1.13.531 2.21.945 3.214zM10.62 5.298h11.91c-.012-.085-.018-.17-.036-.255-.45-1.6-1.917-2.733-3.633-2.733H14.93c-1.526.766-2.987 1.776-4.31 2.988z" />
        </svg>
    )
}

function SectionHeader({
    eyebrow,
    title,
    description,
    icon: Icon,
}: {
    eyebrow: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}) {
    return (
        <header className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300/80">
                <Icon className="w-3.5 h-3.5" />
                {eyebrow}
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
                {title}
            </h2>
            <p className="text-base text-white/60 leading-relaxed max-w-2xl">{description}</p>
        </header>
    )
}

export default function GettingStartedPage() {
    const templates = DECKS.filter((d) => d.public).map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        slideCount: d.slides.length,
        ...(TEMPLATE_HINTS[d.id] ?? { tagline: '', whenToUse: '' }),
    }))

    return (
        <div className="dark min-h-screen bg-zinc-950 text-white" style={{ colorScheme: 'dark' }}>
            <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-5 sm:px-8 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
                <Link href="/" className="flex items-baseline gap-2 shrink-0">
                    <span className="text-2xl leading-none" aria-hidden>
                        🛝
                    </span>
                    <span className="font-headline text-xl font-bold tracking-tight">NoPoint</span>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub repository"
                        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white transition-colors cursor-pointer select-none"
                    >
                        <GitHubMark className="w-4 h-4" />
                    </a>
                    <Link
                        href="/investors"
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-semibold transition-colors cursor-pointer select-none"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        Browse decks
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-16 sm:gap-20">
                {/* Hero */}
                <section className="flex flex-col gap-5">
                    <span className="inline-flex items-center gap-2 self-start text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300/80">
                        <Sparkles className="w-3.5 h-3.5" />
                        Get started
                    </span>
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                        Run it locally, then point your AI at your deck.
                    </h1>
                    <p className="text-lg text-white/65 leading-relaxed max-w-2xl">
                        Two buttons. One copies a setup prompt for Claude Code / Cursor / Codex.
                        The other opens the repo on GitHub. Pick whichever path fits.
                    </p>
                </section>

                {/* 1. Clone & run */}
                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 1"
                        title="Clone and run"
                        description="Paste the prompt below into Claude Code, Cursor, or Codex from any folder — your AI clones the repo, installs dependencies, and starts the dev server. Or do it manually."
                        icon={Terminal}
                    />
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <CopyPromptButton prompt={SETUP_PROMPT} label="Copy setup prompt" />
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-bold transition-colors cursor-pointer select-none"
                        >
                            <GitHubMark className="w-4 h-4" />
                            Clone on GitHub
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                    </div>
                    <pre className="max-h-[28rem] overflow-auto rounded-xl bg-black/40 border border-white/10 p-4 text-[12px] leading-relaxed text-white/80 whitespace-pre-wrap">
                        {SETUP_PROMPT}
                    </pre>
                    <details className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/70">
                        <summary className="cursor-pointer font-semibold text-white/85">
                            Prefer to run it by hand?
                        </summary>
                        <pre className="mt-3 rounded-lg bg-black/40 border border-white/8 p-3 text-[12px] leading-relaxed text-white/80 whitespace-pre-wrap">
{`git clone ${REPO_URL}.git nopoint
cd nopoint
bun install        # or: npm install
cp .env.local.example .env.local
bun dev            # or: npm run dev  →  http://localhost:6829`}
                        </pre>
                    </details>
                </section>

                {/* 2. Bring your deck */}
                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 2"
                        title="Bring your existing deck"
                        description="We don't process uploads here — the smart move is to attach your source material directly to the AI editor you just started. Drop the prompt below into Claude Code / Cursor / Codex, then attach what you've got. The AI rebuilds the deck from scratch as React components."
                        icon={Upload}
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/80">
                                <FileText className="w-3.5 h-3.5" />
                                Option A — file
                            </div>
                            <p className="text-sm text-white/65 leading-relaxed">
                                PDF, PPTX, Keynote export, or a markdown outline. Drag-drop the file straight into your editor&apos;s chat — Claude Code / Cursor / Codex all read attachments natively.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/80">
                                <ImageIcon className="w-3.5 h-3.5" />
                                Option B — screenshots
                            </div>
                            <p className="text-sm text-white/65 leading-relaxed">
                                One screenshot per slide, in order. Paste or drag them all in at once. Best route when the source is locked behind a viewer (Pitch, Beautiful, Google Slides without export rights).
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1">
                                <div className="text-sm font-bold text-white">
                                    Import prompt
                                </div>
                                <div className="text-xs text-white/55 leading-relaxed">
                                    Copy this, paste it into your editor, and attach the file or screenshots in the same message. The AI does the rest.
                                </div>
                            </div>
                            <CopyPromptButton prompt={IMPORT_PROMPT} label="Copy import prompt" />
                        </div>
                        <pre className="max-h-72 overflow-auto rounded-lg bg-black/40 border border-white/8 p-3 text-[11px] leading-relaxed text-white/75 whitespace-pre-wrap">
                            {IMPORT_PROMPT}
                        </pre>
                    </div>
                </section>

                {/* 3. Templates */}
                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 3"
                        title="Or fork a template"
                        description="Every public deck below is a complete worked example you can copy and rewrite. Open one to see how slides, context, and DECK.md fit together."
                        icon={BookOpen}
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                        {templates.map((t) => (
                            <Link
                                key={t.id}
                                href={`/investors/decks/${t.id}`}
                                className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-5 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="text-sm font-bold text-white">
                                            {t.title}
                                        </div>
                                        {t.tagline ? (
                                            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                                                {t.tagline}
                                            </div>
                                        ) : null}
                                    </div>
                                    <span className="text-[11px] tabular-nums text-white/40 shrink-0">
                                        {t.slideCount} slides
                                    </span>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {t.whenToUse || t.description}
                                </p>
                                <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-white/55 group-hover:text-white transition-colors">
                                    Open deck
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. Extending data sources */}
                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 4"
                        title="Extending data source pulling"
                        description="Slides are React components, so a slide can render whatever data you can fetch. Two patterns cover almost everything: a managed embed for charts, or a Node route handler for anything else."
                        icon={Plug}
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                        <a
                            href="https://chartcastr.com?utm_source=nopoint&utm_medium=getting-started&utm_campaign=referral&utm_content=integrations"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://chartcastr.com/dark-logo-bg.png"
                                    alt="Chartcastr"
                                    className="h-9 w-9 rounded-md object-contain shrink-0"
                                />
                                <div className="flex flex-col">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                                        Out of the box
                                    </div>
                                    <div className="text-sm font-bold text-white">
                                        Chartcastr
                                    </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 ml-auto shrink-0 transition-colors" />
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">
                                Embeddable charts pulled live from your CRM, warehouse, Stripe or GA, with optional AI commentary (board-style summaries). Drop a{' '}
                                <code className="text-white/80">&lt;ChartcastrSource&gt;</code> into a slide and it stays current — exports cleanly to PDF / PPTX too.
                            </p>
                            <p className="text-xs text-white/45 leading-relaxed">
                                Set <code className="text-white/70">CHARTCASTR_API_KEY</code> in{' '}
                                <code className="text-white/70">.env.local</code> — grab one at{' '}
                                <span className="text-blue-300/80 group-hover:text-blue-300 underline underline-offset-2">
                                    chartcastr.com/admin/settings/api-keys
                                </span>
                                .
                            </p>
                        </a>

                        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                            <div className="flex items-center gap-3">
                                <span
                                    className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-lg shrink-0"
                                    aria-hidden
                                >
                                    🔌
                                </span>
                                <div className="flex flex-col">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                                        Anything else
                                    </div>
                                    <div className="text-sm font-bold text-white">
                                        Any data source API
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">
                                It&apos;s just Node. Add a route handler under{' '}
                                <code className="text-white/80">app/api/&lt;source&gt;/route.ts</code> that{' '}
                                <code className="text-white/80">fetch()</code>es your data, then call it from a Server Component slide. Credentials stay server-side.
                            </p>
                        </div>
                    </div>
                    <pre className="max-h-[20rem] overflow-auto rounded-xl bg-black/40 border border-white/10 p-4 text-[12px] leading-relaxed text-white/80 whitespace-pre">
{`// app/api/stripe-mrr/route.ts
export async function GET() {
    const r = await fetch('https://api.stripe.com/v1/...', {
        headers: { Authorization: \`Bearer \${process.env.STRIPE_KEY}\` },
        next: { revalidate: 300 },
    })
    const data = await r.json()
    return Response.json({ mrr: data.mrr })
}

// components/decks/<deck-id>/slides/mrr-slide.tsx
export async function MrrSlide() {
    const { mrr } = await fetch('http://localhost:6829/api/stripe-mrr').then(r => r.json())
    return <div className="text-9xl font-bold">\${mrr.toLocaleString()}</div>
}`}
                    </pre>
                </section>

                {/* 5. Next */}
                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 5"
                        title="Read the conventions"
                        description="Three short docs cover everything an AI agent needs to author slides without drift."
                        icon={ArrowRight}
                    />
                    <div className="grid sm:grid-cols-3 gap-3">
                        <a
                            href={`${REPO_URL}/blob/master/AGENTS.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-4 transition-colors"
                        >
                            <div className="text-sm font-bold text-white">AGENTS.md</div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                The contract for AI editors: slide context, variants, controls, the 1280×720 canvas rule.
                            </p>
                        </a>
                        <a
                            href={`${REPO_URL}/blob/master/components/decks/seed-2026/DECK.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-4 transition-colors"
                        >
                            <div className="text-sm font-bold text-white">DECK.md (worked example)</div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                seed-2026&apos;s principles, slide plan, and hard rules. Copy this shape for your own deck.
                            </p>
                        </a>
                        <a
                            href={`${REPO_URL}/blob/master/README.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-4 transition-colors"
                        >
                            <div className="text-sm font-bold text-white">README.md</div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                Stack, env vars, deploy recipes for Vercel / Railway / VPS / Docker.
                            </p>
                        </a>
                    </div>
                </section>

                <section className="flex flex-col gap-6">
                    <SectionHeader
                        eyebrow="Step 6"
                        title="Host it live"
                        description="Push to your own GitHub repo, deploy to Vercel or Railway, and put it on a custom domain. No vendor lock-in, no hosted cloud, no per-investor pricing tier."
                        icon={Rocket}
                    />
                    <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <li className="flex flex-col gap-2 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-white/90">
                                <GitBranch className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-bold">Fork & commit</span>
                            </div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                Push your local clone to a private GitHub repo of your own. Decks live in git history — versioned with the rest of your code.
                            </p>
                        </li>
                        <li className="flex flex-col gap-2 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-white/90">
                                <Rocket className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-bold">One-click deploy</span>
                            </div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                Import to Vercel or Railway — both auto-detect Next.js. Set{' '}
                                <code className="font-mono text-[11px] px-1 py-px rounded bg-white/[0.06] text-white/80">
                                    INVESTOR_SESSION_SECRET
                                </code>{' '}
                                in the dashboard and you&apos;re live.
                            </p>
                        </li>
                        <li className="flex flex-col gap-2 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2 text-white/90">
                                <Globe className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-bold">Custom domain</span>
                            </div>
                            <p className="text-xs text-white/55 leading-relaxed">
                                Point{' '}
                                <code className="font-mono text-[11px] px-1 py-px rounded bg-white/[0.06] text-white/80">
                                    decks.yourcompany.com
                                </code>{' '}
                                at the deployment. Send investors a link on your own domain — not a shared SaaS host.
                            </p>
                        </li>
                    </ol>
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdrmrduck%2Fnopoint&env=INVESTOR_SESSION_SECRET&envDescription=HMAC%20key%20for%20investor%20session%20cookies%20%E2%80%94%20generate%20with%20openssl%20rand%20-hex%2032&envLink=https%3A%2F%2Fgithub.com%2Fdrmrduck%2Fnopoint%23environment&project-name=nopoint&repository-name=nopoint"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-white text-black hover:bg-white/90 text-sm font-semibold transition-colors cursor-pointer select-none"
                        >
                            <VercelMark className="w-3.5 h-3.5" />
                            Deploy to Vercel
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href="https://railway.com/new?template=https%3A%2F%2Fgithub.com%2Fdrmrduck%2Fnopoint"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#1a1f2e] hover:bg-[#222837] border border-white/15 text-white text-sm font-semibold transition-colors cursor-pointer select-none"
                        >
                            <RailwayMark className="w-4 h-4" />
                            Deploy to Railway
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`${REPO_URL}#deploying`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-semibold transition-colors cursor-pointer select-none"
                        >
                            Deploy docs
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>
            </main>
        </div>
    )
}

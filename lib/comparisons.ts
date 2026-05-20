// Stub data for "why nopoint and not X" comparison pages.
// Edit each entry as you talk to real users about which alternative they
// almost picked. Keep verdicts honest: name what the other tool is better at.

export interface ComparisonRow {
    feature: string
    nopoint: string
    them: string
}

export interface Comparison {
    slug: string
    competitor: string
    // One-line frame for the entire page (also used as the page eyebrow).
    framing: string
    // The headline. Two short sentences, no em-dashes.
    headline: string
    // 1-2 sentence honest verdict that runs above the fold.
    verdict: string
    // Concrete row-by-row breakdown. Keep to 5-8 rows.
    table: ComparisonRow[]
    // What the other tool is actually good for. Be specific. No straw man.
    theirStrengths: string[]
    // What nopoint is good for in this particular comparison.
    ourStrengths: string[]
    // The pick-this-one heuristic.
    pickThemIf: string[]
    pickUsIf: string[]
    // FAQ entries shown on the page and in JSON-LD.
    faqs: Array<{ q: string; a: string }>
}

export const COMPARISONS: Comparison[] = [
    {
        slug: 'manus',
        competitor: 'Manus',
        framing: 'Generated deck vs. owned codebase',
        headline: 'Manus hands you a finished deck. NoPoint hands you the source.',
        verdict:
            'Manus is the fastest way to get a generic deck on screen. NoPoint is the fastest way to get a deck that matches your real numbers and survives twenty revisions without rotting.',
        table: [
            { feature: 'Output', nopoint: 'React components in your repo', them: 'Hosted slide deck' },
            { feature: 'Versioning', nopoint: 'git, with diffs and branches', them: 'Cloud autosave' },
            { feature: 'Live data', nopoint: 'Any API your code can hit', them: 'Whatever the agent could scrape at generation time' },
            { feature: 'Investor-specific variants', nopoint: 'Per-credential at runtime', them: 'Regenerate the whole deck' },
            { feature: 'Lock-in', nopoint: 'None. It is your codebase.', them: 'Your deck lives on their platform' },
            { feature: 'Hosting', nopoint: 'Your domain, your Vercel or Railway', them: 'Their domain' },
        ],
        theirStrengths: [
            'You have nothing yet and want something on screen in an hour.',
            'You will throw the deck away after one meeting.',
            'You are fine letting an agent decide the story.',
        ],
        ourStrengths: [
            'You already write code and want the deck to live next to it.',
            'You revise the deck every week and want a real diff per change.',
            'You want one slide that always shows your live MRR or pipeline number, not a screenshot from last month.',
            'You want different cuts per investor without remaking the whole file.',
        ],
        pickThemIf: [
            'You do not write code and do not want to.',
            'The deck is one-off and disposable.',
        ],
        pickUsIf: [
            'You already have a repo and an AI editor open.',
            'You expect to revise the deck more than five times.',
            'You want at least one slide pulling live data.',
        ],
        faqs: [
            {
                q: 'Can NoPoint generate a deck from a prompt the way Manus does?',
                a: 'Not on its own. NoPoint is a runtime and a set of conventions. Pair it with Claude Code, Cursor, or Codex pointed at the repo and you get the same one-prompt flow, with the output committed to git instead of trapped in a hosted product.',
            },
            {
                q: 'What happens if Manus shuts down a project?',
                a: 'Your deck goes with it. NoPoint runs on your own hosting, so the same deployment keeps working even if the upstream OSS project pauses.',
            },
            {
                q: 'How long does it take to bring an existing deck into NoPoint?',
                a: 'Most decks rebuild in 15 to 30 minutes when you point an AI editor at the source PDF or PPTX. The Getting Started page ships a copy-paste prompt for that exact job.',
            },
        ],
    },
    {
        slug: 'canva-slides',
        competitor: 'Canva Slides',
        framing: 'Graphics editor vs. component runtime',
        headline: 'Canva is a graphics editor that does slides. NoPoint is a codebase that ships slides.',
        verdict:
            'Canva wins on visual polish out of the box. NoPoint wins the moment your deck needs to pull a real number, support per-investor variants, or live in git alongside the rest of your product.',
        table: [
            { feature: 'Authoring', nopoint: 'Code (or AI editor writing code)', them: 'Drag and drop in a browser' },
            { feature: 'Reuse across slides', nopoint: 'Import a component', them: 'Copy the layer and hope' },
            { feature: 'Live data', nopoint: 'fetch() in a Server Component', them: 'Paste a number, update it later by hand' },
            { feature: 'Diffing changes', nopoint: 'git diff', them: 'Version history modal' },
            { feature: 'Export to PDF / PPTX', nopoint: 'Built in, deterministic', them: 'Built in, sometimes restyles' },
            { feature: 'Brand consistency', nopoint: 'One tokens file', them: 'Brand kit per design' },
        ],
        theirStrengths: [
            'You want pixel-level control of a poster-style slide without writing code.',
            'Your team is non-technical and lives in a browser.',
            'The deck is content marketing, not investor data.',
        ],
        ourStrengths: [
            'You want a slide that renders the same MRR figure your finance dashboard shows.',
            'You want one component to handle all "metric card" slides, not five hand-tweaked copies.',
            'You want the deck reviewed in the same PR flow as your product code.',
        ],
        pickThemIf: [
            'The deck is a one-shot marketing artifact.',
            'You will never wire it to live data.',
        ],
        pickUsIf: [
            'You already commit code daily.',
            'At least one slide should show numbers that change.',
            'You want the deck to inherit your design system, not the other way round.',
        ],
        faqs: [
            {
                q: 'Does NoPoint look as polished as Canva?',
                a: 'It looks however your CSS looks. The seed-2026 deck and the AirBed and Breakfast clone ship as reference points. If your product already has a design system, NoPoint slides inherit it for free.',
            },
            {
                q: 'Can I import a Canva deck into NoPoint?',
                a: 'Export the Canva deck to PDF, point an AI editor at the file, and use the import prompt on the Getting Started page. The editor rebuilds it as React components.',
            },
            {
                q: 'What about brand kits and team templates?',
                a: 'A NoPoint repo is the brand kit. Tokens, fonts, colors, and reusable layouts live in code and apply to every slide automatically.',
            },
        ],
    },
    {
        slug: 'pitch',
        competitor: 'Pitch',
        framing: 'Collaborative SaaS vs. self-hosted source',
        headline: 'Pitch is a collaborative deck SaaS. NoPoint is a codebase.',
        verdict:
            'Pitch is built for marketing teams that live in a shared workspace. NoPoint is built for founders and product teams that already live in a repo and want the investor deck to follow the same rules as the codebase.',
        table: [
            { feature: 'Where the deck lives', nopoint: 'Your git repo', them: 'Their workspace' },
            { feature: 'Collaboration', nopoint: 'PRs and review comments', them: 'Real-time multi-cursor' },
            { feature: 'Permissions', nopoint: 'Per-credential access in lib/investors', them: 'Workspace roles' },
            { feature: 'Custom domain', nopoint: 'Yours, on Vercel or Railway', them: 'Custom domains on paid tiers' },
            { feature: 'Analytics', nopoint: 'Add your own provider', them: 'Built in, on their plan' },
            { feature: 'Offline edits', nopoint: 'Yes. It is code.', them: 'Limited' },
        ],
        theirStrengths: [
            'Multiple people editing the same slide in real time, like a Google Doc.',
            'Built-in view analytics without writing code.',
            'A non-technical team that needs a shared workspace, not a repo.',
        ],
        ourStrengths: [
            'Engineers reviewing deck copy in the same PR queue as product code.',
            'A deck that survives your SaaS bill going up next quarter.',
            'A deck on a domain you actually own.',
        ],
        pickThemIf: [
            'Your team is marketing-heavy and needs real-time co-editing.',
            'You prefer paying for a hosted workspace over self-hosting.',
        ],
        pickUsIf: [
            'You want the deck reviewed in GitHub, not a SaaS UI.',
            'You want to retire the deck without canceling a subscription.',
        ],
        faqs: [
            {
                q: 'Can NoPoint replicate Pitch view analytics?',
                a: 'You can wire any analytics provider you already use. The repo ships without tracking by design so forks pick their own. A few lines of PostHog or Plausible in app/layout.tsx covers it.',
            },
            {
                q: 'Is there a real-time co-editing mode?',
                a: 'No. The collaboration model is git. Two people editing two slides at once is a normal PR. Two people editing the same slide is a merge conflict, which is also normal.',
            },
        ],
    },
    {
        slug: 'gamma',
        competitor: 'Gamma',
        framing: 'AI as author vs. AI as co-author',
        headline: 'Gamma writes the slide for you. NoPoint lets you write the slide once and keep it.',
        verdict:
            'Gamma is a great first draft engine. NoPoint is what you want after the draft, when the deck has to survive a board meeting, a follow-up email, and twelve more rounds of edits without losing its shape.',
        table: [
            { feature: 'First draft', nopoint: 'AI editor, in your repo', them: 'AI prompt, in their app' },
            { feature: 'Source of truth', nopoint: 'Components in git', them: 'Their hosted document' },
            { feature: 'Numbers on a slide', nopoint: 'fetch() from your API', them: 'Typed in, drift over time' },
            { feature: 'Investor-specific cuts', nopoint: 'Variants and credentials', them: 'Duplicate the doc' },
            { feature: 'Theming', nopoint: 'Tailwind + tokens', them: 'Built-in themes' },
            { feature: 'Export', nopoint: 'PDF, PPTX (image-based)', them: 'PDF, PPTX' },
        ],
        theirStrengths: [
            'You want a deck written for you in one shot from a prompt.',
            'You like Notion-style block editing for slides.',
            'You will not touch the deck again after the meeting.',
        ],
        ourStrengths: [
            'You will revise the deck weekly for the next six months.',
            'You want the same source to drive a printed deck and a live web view.',
            'You want a slide that says "MRR" and means it.',
        ],
        pickThemIf: [
            'The deck is one round of editing away from done.',
            'No slide ever needs to reflect live data.',
        ],
        pickUsIf: [
            'You expect the deck to keep changing.',
            'You want the deck to live in the same repo as the product.',
        ],
        faqs: [
            {
                q: 'Can NoPoint give me a Gamma-style "generate from prompt" flow?',
                a: 'Yes, through your AI editor. Open Claude Code or Cursor in the repo, paste the import prompt from the Getting Started page, and you get a generated deck committed to git instead of stored in a hosted doc.',
            },
            {
                q: 'What about the AI image generation Gamma ships?',
                a: 'NoPoint does not generate images itself. Any image tool that outputs files into /public works. If you use Gemini, Midjourney, or a Replicate model, save the asset to the repo and reference it from a slide.',
            },
        ],
    },
    {
        slug: 'beautiful-ai',
        competitor: 'Beautiful.ai',
        framing: 'Smart templates vs. composable components',
        headline: 'Beautiful.ai auto-formats templates. NoPoint composes components.',
        verdict:
            'Beautiful.ai is a templates-with-rules editor for people who do not want to think about layout. NoPoint assumes you, or your AI editor, can compose a layout once and reuse it forever.',
        table: [
            { feature: 'Layout model', nopoint: 'Components you write or copy', them: 'Smart templates that adjust' },
            { feature: 'Custom layouts', nopoint: 'A new file', them: 'Limited' },
            { feature: 'Reuse', nopoint: 'Import the component', them: 'Duplicate the slide' },
            { feature: 'Data binding', nopoint: 'Anywhere fetch works', them: 'Manual or via integration tier' },
            { feature: 'Hosting', nopoint: 'Yours', them: 'Theirs' },
            { feature: 'Cost at scale', nopoint: 'Your hosting bill', them: 'Per-seat SaaS' },
        ],
        theirStrengths: [
            'You want a polished slide without learning a layout system.',
            'You want auto-format to clean up sloppy input.',
            'Your team is non-technical and does not want a repo.',
        ],
        ourStrengths: [
            'You want a layout that does exactly what you wrote, every time.',
            'You want to reuse a metric card or quote slide across decks without duplicating.',
            'You want one place to change a token and have every slide follow.',
        ],
        pickThemIf: [
            'Auto-formatting is a feature, not a constraint, for you.',
            'You do not want to host anything.',
        ],
        pickUsIf: [
            'You want layout control without a hosted editor in the way.',
            'You want the deck on your domain, on your stack.',
        ],
        faqs: [
            {
                q: 'Does NoPoint have auto-format like Beautiful.ai?',
                a: 'No. The 1280 by 720 design canvas and a Tailwind setup are the guard rails. If you want auto-format, write a layout component once and reuse it.',
            },
            {
                q: 'Can I match a Beautiful.ai theme inside NoPoint?',
                a: 'Yes. Pick the colors and fonts you like and set them in tailwind.config and globals.css. Every slide inherits them.',
            },
        ],
    },
]

export function getComparisonSlugs(): string[] {
    return COMPARISONS.map((c) => c.slug)
}

export function findComparison(slug: string): Comparison | undefined {
    return COMPARISONS.find((c) => c.slug === slug)
}

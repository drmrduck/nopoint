import type { SlideDefinition } from '../../types'
import { TitleSlide } from './title-slide'
import { TitleControls } from './title-controls'
import { ProblemSlide } from './problem-slide'
import { ProblemMondayMorningVariant } from './problem-variants/monday-morning'
import { ProblemThreeTruthsVariant } from './problem-variants/three-truths'
import { ProblemStaleNumbersVariant } from './problem-variants/stale-numbers'
import { SolutionSlide } from './solution-slide'
import { WhyNowSlide } from './why-now-slide'
import { ProductSlide } from './product-slide'
import { MarketSlide } from './market-slide'
import { TractionSlide } from './traction-slide'
import { LandscapeSlide } from './landscape-slide'
import { LandscapeControls } from './landscape-controls'
import { BusinessModelSlide } from './business-model-slide'
import { TeamSlide } from './team-slide'
import { AskSlide } from './ask-slide'

export type { SlideDefinition } from '../../types'

export const SLIDES: SlideDefinition[] = [
    {
        id: 'title',
        title: 'Title',
        component: TitleSlide,
        controls: TitleControls,
        publicControls: true,
        context: {
            category: 'Title',
            principles: ['First impression sets the lens.', 'Tagline + one promise + one date.'],
            goals: [
                'Explain who the company is in one screen.',
                'Signal that this is software for investor storytelling, not another slide toy.',
                'Make the live, code-driven nature obvious: dot-grid background reacts to the cursor and is tunable from the Controls pill.',
            ],
            whatItIsNot: 'Not a feature collage or a founder bio slide.',
            nailsThis: 'States who, what, and when in five seconds, with a live mouse-repelling dot grid that proves the slide is software, not an export.',
            storyThread: 'Sets up the question every later slide answers: "why does this need to exist now?"',
        },
    },
    {
        id: 'problem',
        title: 'Problem',
        component: ProblemSlide,
        defaultVariant: 'default',
        variants: {
            default: { label: 'Quadrants', component: ProblemSlide },
            'monday-morning': { label: 'Monday morning', component: ProblemMondayMorningVariant },
            'three-truths': { label: 'Three truths', component: ProblemThreeTruthsVariant },
            'stale-numbers': { label: 'Stale numbers', component: ProblemStaleNumbersVariant },
        },
        context: {
            category: 'Problem',
            principles: [
                'Show the pain before the product.',
                'Specific costs > abstract complaints.',
                'The reader should recognise the problem in <5 seconds.',
                'Have at least one variant that lands the live-data / code-reach pain for technical investors.',
            ],
            goals: [
                'Make the pain feel operational, not aesthetic.',
                'Give the Solution slide four clean problems to resolve.',
                'Offer a framing (stale-numbers variant) that lands the npm/`import`-in-your-deck angle without spoiling the Solution.',
            ],
            whatItIsNot: 'Not a generic rant about PowerPoint or a market-size argument.',
            nailsThis: 'Names the four costs of static decks (leakage, sameness, out-of-band feedback, ops drag) by default; variants reframe as Monday-morning leakage, three declarative truths, or a copy-paste/stale-numbers grind that hints at the npm-import-in-your-deck angle.',
            storyThread: 'Every cost the Problem slide names becomes a feature on the Solution slide.',
        },
    },
    {
        id: 'solution',
        title: 'Solution',
        component: SolutionSlide,
        context: {
            category: 'Solution',
            principles: ['Headline names the artifact.', 'Resolution verb in the first sentence.'],
            goals: [
                'Resolve the exact costs named on the Problem slide.',
                'Give the investor a concrete artifact to picture.',
            ],
            whatItIsNot: 'Not the deep product walkthrough or a laundry list of capabilities.',
            nailsThis: 'Four resolution verbs (Gate it, Personalise it, Capture it, Pipe it) mirror the four Problem costs in the same order. No new vocabulary.',
            storyThread: 'Sets up "but how" — answered by the Why Now and Product slides.',
        },
    },
    {
        id: 'why-now',
        title: 'Why Now',
        component: WhyNowSlide,
        context: {
            category: 'Why Now',
            principles: ['Three external shifts, dated.', 'Show the door that opened.'],
            goals: [
                'Explain why this wedge becomes viable now instead of earlier.',
                'Anchor the story in external shifts, not founder willpower.',
            ],
            whatItIsNot: 'Not a generic AI-trend slide or a disguised product roadmap.',
            nailsThis: 'Three dated shifts: 2022 component primitives, 2024 mainstream coding agents, 2026 agent-native artifacts. No inside-baseball.',
            storyThread: 'Investors ask "why hasn\'t this been built before?" — this slide answers it.',
        },
    },
    {
        id: 'product',
        title: 'Product',
        component: ProductSlide,
        context: {
            category: 'Product',
            principles: [
                'Features earn their place by mapping to a Problem.',
                'Live, not screenshots.',
                'Interactive like a website — because it is one.',
            ],
            goals: [
                'Show what the logged-in workflow actually feels like.',
                'Map each meaningful feature back to a named pain.',
                'Make the "full npm + private portal + programmatic + AI personalisation + live data" capability set legible in one screen.',
            ],
            whatItIsNot: 'Not a roadmap promise deck or a wall of UI chrome.',
            nailsThis: 'Five primitives, each tagged with the Problem-cost it closes (leakage, sameness, feedback, ops drag, foundation). The mapping is visible on the slide, not implied.',
            storyThread: 'Investor leaves this slide with a concrete mental model of "what would I see if I logged in."',
        },
    },
    {
        id: 'market',
        title: 'Market',
        component: MarketSlide,
        context: {
            category: 'Market',
            principles: ['TAM math, not analyst reports.', 'Customers × price = revenue, recomputable in your head.'],
            goals: [
                'Give the investor a bottom-up SOM they can sanity-check while reading.',
                'Show the wedge as a slice of an already-real category, not a green-field claim.',
            ],
            whatItIsNot: 'Not a landscape grid (that\'s the Why-We-Win slide) or a vanity TAM flex.',
            nailsThis: 'Three customer × price rows that sum to ≈$258M SOM, with one footnote anchoring against the existing AI-deck SaaS run rate.',
            storyThread: 'Sets up Traction: the market is real and recomputable, so the next question is whether NoPoint has any pull yet.',
        },
    },
    {
        id: 'traction',
        title: 'Traction',
        component: TractionSlide,
        chartcastrSourceIds: ['b670aa09-e025-4ca6-a2f5-8fe57786f3ab'],
        context: {
            category: 'Traction',
            principles: ['Funnel as evidence.', 'Direction > absolute numbers.'],
            goals: [
                'Prove the workflow has momentum before mature revenue exists.',
                'Show progression, not isolated vanity numbers.',
            ],
            whatItIsNot: 'Not a fake revenue spike or a retrospective victory lap.',
            nailsThis: 'Live Google Search Console chart embedded via <ChartcastrSource> carries the load — real organic traffic against three honest Day-1 stats (1 deck live, 0 customers, ∞ iteration). The chart prefetches on deck mount, so it renders instantly.',
            storyThread: 'Sets up "but you\'re not the only one doing this" — answered by Why We Win.',
        },
    },
    {
        id: 'landscape',
        title: 'Why We Win',
        component: LandscapeSlide,
        controls: LandscapeControls,
        context: {
            category: 'Why We Win',
            principles: ['Show the empty quadrant.', "Never claim you're 'the best'."],
            goals: [
                'Position NoPoint relative to real alternatives without denial.',
                'Claim the code-first workflow as the deliberate wedge.',
            ],
            whatItIsNot: 'Not a dishonest comparison chart or a broad "everyone else is bad" slide.',
            nailsThis: 'Two-axis quadrant (you-write-the-code ↔ generated × stays in editor ↔ leaves it). Bottom-left = PowerPoint/GSlides/Keynote + AI bolt-ons. Bottom-right = Gamma/Pitch/Tome/Canva + Replit Slides (because Replit emits React but you author via prompt — code is a build artifact). Top-left empty cell explicitly explains why Replit doesn\'t qualify. NoPoint sits alone top-right.',
            storyThread: 'Closes the "why you" arc; opens the "how do you make money" arc.',
        },
    },
    {
        id: 'business-model',
        title: 'Business Model',
        component: BusinessModelSlide,
        context: {
            category: 'Business Model',
            principles: ['OSS distribution, paid hosted capture.', 'Show the upgrade trigger, not just the prices.'],
            goals: [
                'Explain how open-source adoption turns into paid revenue.',
                'Make each tier feel tied to a real user persona.',
            ],
            whatItIsNot: 'Not pricing theater or a hand-wave at enterprise someday.',
            nailsThis: 'Three tiers tied to clear personas; each price is a recoverable test.',
            storyThread: 'Sets up Team — investors ask "do you have the people to execute on this model?"',
        },
    },
    {
        id: 'team',
        title: 'Team',
        component: TeamSlide,
        context: {
            category: 'Team',
            principles: ['Why us, specifically.', 'Earned secret > resume bullets.'],
            goals: [
                'Show why this team is unusually suited to this workflow wedge.',
                'Tie the team story back to product and go-to-market execution.',
            ],
            whatItIsNot: 'Not a LinkedIn summary, an advisor-logo slide, or a humblebrag.',
            nailsThis: 'Casual, self-aware one-liner — "a guy who builds too many pitch decks." Earned secret framed as a personal itch, not a credential.',
            storyThread: 'Final setup before the Ask — "given all of the above, here is what we need."',
        },
    },
    {
        id: 'ask',
        title: 'Ask',
        component: AskSlide,
        context: {
            category: 'Ask',
            principles: ['Round size, milestones, runway.', 'No new information after this slide.'],
            goals: [
                'State the raise clearly and what the next 18 months buy.',
                'Close the story without reopening earlier debates.',
            ],
            whatItIsNot: 'Not a surprise new feature pitch or a vague "let\'s chat" ending.',
            nailsThis: 'States the cheque ($1.5M), what 18 months buys (75 paying teams, Series A 2027), and a 60/25/15 use-of-funds split (engineering / GTM / ops).',
            storyThread: 'Closes the deck. Anything after this is contact-info or appendix.',
        },
    },
]

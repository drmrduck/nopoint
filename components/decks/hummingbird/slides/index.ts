import type { SlideDefinition } from '../../types'
import { TitleSlide } from './title-slide'
import { ProblemSlide } from './problem-slide'
import { SolutionSlide } from './solution-slide'
import { DemoSlide } from './demo-slide'
import { TractionSlide } from './traction-slide'
import { TeamSlide } from './team-slide'
import { AskSlide } from './ask-slide'

export type { SlideDefinition } from '../../types'

export const SLIDES: SlideDefinition[] = [
    {
        id: 'title',
        title: 'Title',
        component: TitleSlide,
        context: {
            category: 'Title',
            principles: ['First impression sets the lens.', 'Tagline + one promise + founders.'],
            goals: [
                'Name the company, the wedge, and the founders in five seconds.',
                'Make "billing in 60 seconds" the line the investor remembers.',
            ],
            whatItIsNot: 'Not a feature collage, not a logo wall, not a vision statement.',
            nailsThis: 'Hummingbird · Stripe billing in 60 seconds for indie SaaS · Jamie & Sam, in one screen.',
            storyThread: 'Sets up the question: "why does shipping payments still take two weeks?"',
        },
    },
    {
        id: 'problem',
        title: 'Problem',
        component: ProblemSlide,
        context: {
            category: 'Problem',
            principles: [
                'Show the pain in numbers, not adjectives.',
                'Specific costs > abstract complaints.',
            ],
            goals: [
                'Make the indie-founder Stripe-tax feel operational.',
                'Give the Solution slide concrete pains to resolve in order.',
            ],
            whatItIsNot: 'Not a generic "payments are hard" rant or an attack on Stripe itself.',
            nailsThis: 'Four numbers — 2 weeks lost, 60% never re-engage, 4 surfaces to babysit, $0 revenue while half-built.',
            storyThread: 'Every cost named here gets resolved in order on the Solution slide.',
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
                'Resolve the Problem-slide costs with one verb each.',
                'Make the install path concrete: npm i hummingbird, ship.',
            ],
            whatItIsNot: 'Not a feature menu or a roadmap promise.',
            nailsThis: 'Four resolution lines — install, hosted webhook, hosted portal, one CLI command.',
            storyThread: 'Sets up "show me what the code looks like" — answered by the Demo slide.',
        },
    },
    {
        id: 'demo',
        title: 'Demo',
        component: DemoSlide,
        context: {
            category: 'Demo',
            principles: ['Show, do not tell.', 'Real code beats screenshots.'],
            goals: [
                'Prove the 60-second claim with a 3-line config.',
                'Make the API surface look as small as the pitch promises.',
            ],
            whatItIsNot: 'Not a full SDK reference or a screenshot of an admin UI.',
            nailsThis: 'A single billing.ts file: import, hummingbird({ stripeKey, plans, portal: true }), done.',
            storyThread: 'Sets up Traction: "the code is small — but does anyone use it?"',
        },
    },
    {
        id: 'traction',
        title: 'Traction',
        component: TractionSlide,
        context: {
            category: 'Traction',
            principles: [
                'Live numbers > screenshotted numbers.',
                'One headline metric, three supporting stats.',
            ],
            goals: [
                'Show MRR as a live read from Stripe so the deck never goes stale.',
                'Anchor the headline with WAU, growth rate, and time-to-first-charge.',
            ],
            whatItIsNot: 'Not a hockey-stick chart or a vanity-only metric wall.',
            nailsThis: 'MRR pulled live from `STRIPE_KEY` via `/api/stripe-mrr` (server component fetch, 5-min revalidate). Falls back to the static $48K headline if the key is unset or Stripe is unreachable, with a Live/Static badge so the audience can tell which they are seeing.',
            storyThread: 'Sets up Team: "the numbers are real — who is behind them?"',
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
                'Establish ex-Stripe credibility in two lines.',
                'Tie Connect (Jamie) and Tax (Sam) directly to the surfaces the product hides.',
            ],
            whatItIsNot: 'Not a LinkedIn summary or an advisor-logo wall.',
            nailsThis: 'Two ex-Stripe engineers, each tagged to the exact surface area their old team owned.',
            storyThread: 'Final setup before the Ask — "given the wedge, the demo, the numbers, and us, here is the cheque."',
        },
    },
    {
        id: 'ask',
        title: 'The Ask',
        component: AskSlide,
        context: {
            category: 'Ask',
            principles: ['Round size, valuation, milestones.', 'No new information after this slide.'],
            goals: [
                'State the cheque clearly: $2M seed at $14M post.',
                'Show how the money is split.',
            ],
            whatItIsNot: 'Not a surprise feature reveal or a vague "let\'s chat" closer.',
            nailsThis: 'States the round ($2M / $14M post / 24mo runway) and a 55/30/15 use-of-funds split (engineering / dev GTM / ops).',
            storyThread: 'Closes the deck. Anything after this is contact info or appendix.',
        },
    },
]

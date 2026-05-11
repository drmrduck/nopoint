import type { SlideDefinition } from '../../types'
import { PlaceholderSlide } from './placeholder-slide'

const stub = (title: string, subtitle: string, helper: string) => () =>
    PlaceholderSlide({ title, subtitle, helper })

export const SLIDES: SlideDefinition[] = [
    {
        id: 'company-purpose',
        title: 'Company Purpose',
        component: stub(
            'Define the company in one sentence.',
            'Company Purpose',
            "Sequoia opens here. The whole deck is a defense of this sentence. If you can't make this sentence both narrow and ambitious, you're not ready.",
        ),
        context: {
            category: 'Company Purpose',
            principles: ['One sentence.', 'Narrow + ambitious.'],
            nailsThis: 'A definition the rest of the deck is honest to.',
            storyThread: 'Sets up the Problem slide — "and here is what is missing today."',
        },
    },
    {
        id: 'problem',
        title: 'Problem',
        component: stub(
            'Describe the customer pain.',
            'Problem',
            'Whose life is bad today, and why is it bad? Skip the abstractions; quote the customer.',
        ),
        context: {
            category: 'Problem',
            principles: ["Customer's life today.", 'Specific costs > abstractions.'],
            nailsThis: 'A pain a Sequoia partner has felt or seen. No theoretical pain.',
            storyThread: 'Earns the right to introduce the Solution.',
        },
    },
    {
        id: 'solution',
        title: 'Solution',
        component: stub(
            'How you fix it.',
            'Solution',
            'Show the artifact. Demo screenshot, narrative walkthrough, or live render. Resolution verb in the headline.',
        ),
        context: {
            category: 'Solution',
            principles: ['Show the artifact.', 'Resolution verb in headline.'],
            nailsThis: "Investor leaves knowing exactly what they'd see if they used it tomorrow.",
            storyThread: 'Sets up the Why Now question.',
        },
    },
    {
        id: 'why-now',
        title: 'Why Now',
        component: stub(
            'The wave you are riding.',
            'Why Now',
            "Investors ask 'why hasn't this been built before?' This slide answers it with shifts dated within the last 24 months.",
        ),
        context: {
            category: 'Why Now',
            principles: ['Three dated shifts.', 'External, not internal.'],
            nailsThis: 'Pins the wedge to specific recent shifts. Concrete causes.',
            storyThread: 'Sets up Market — "and here is the pool that just opened."',
        },
    },
    {
        id: 'market-size',
        title: 'Market Size',
        component: stub(
            'TAM the partner can recompute.',
            'Market Size',
            'Bottom-up: customers × price = revenue. No analyst chart on its own.',
        ),
        context: {
            category: 'Market Size',
            principles: ['Customers × price = revenue.', 'Bottom-up only.'],
            nailsThis: 'Numbers the partner can verify with two web searches.',
            storyThread: 'Sets up Competition — "this pool, who else is fishing in it?"',
        },
    },
    {
        id: 'competition',
        title: 'Competition',
        component: stub(
            'Honest landscape, sharp positioning.',
            'Competition',
            'List incumbents and adjacent. Show the empty quadrant. Never claim "we are the best."',
        ),
        context: {
            category: 'Competition',
            principles: ['Empty-quadrant positioning.', "Don't claim 'best'."],
            nailsThis: 'Names a segment competitors implicitly de-prioritise and stakes it.',
            storyThread: 'Sets up Product — "and here is exactly how we own that quadrant."',
        },
    },
    {
        id: 'product',
        title: 'Product',
        component: stub(
            'How the product earns its quadrant.',
            'Product',
            'Features map back to Problem. Live or screenshots, not roadmap promises.',
        ),
        context: {
            category: 'Product',
            principles: ['Features map to a Problem.', 'Built > promised.'],
            nailsThis: 'Investor leaves with a concrete mental model of "what would I see if I logged in".',
            storyThread: "Sets up Business Model — 'and here's how money flows through this product'.",
        },
    },
    {
        id: 'business-model',
        title: 'Business Model',
        component: stub(
            'How money flows.',
            'Business Model',
            'Revenue, pricing, margins. Show the upgrade trigger, not just the prices.',
        ),
        context: {
            category: 'Business Model',
            principles: ['Show upgrade trigger.', 'Tiered pricing tied to personas.'],
            nailsThis: 'Each price tier is a recoverable test, not a guess.',
            storyThread: 'Sets up Team — "the people who can execute on this model".',
        },
    },
    {
        id: 'team',
        title: 'Team',
        component: stub(
            'Why this team, specifically.',
            'Team',
            'Earned secret > resume bullets. Each founder gets one verb attached to one outcome.',
        ),
        context: {
            category: 'Team',
            principles: ['Earned secret > resume.', 'Verb per founder.'],
            nailsThis: 'States the unfair advantage in one sentence.',
            storyThread: 'Final setup before Financials.',
        },
    },
    {
        id: 'financials',
        title: 'Financials',
        component: stub(
            'Plan, runway, ask.',
            'Financials',
            'Round size, 18-month milestones, runway. Be specific about the next round.',
        ),
        context: {
            category: 'Financials',
            principles: ['Round size, milestones, runway.', 'No new info after this slide.'],
            nailsThis: 'States the cheque, what 18 months buys, what the next round looks like.',
            storyThread: 'Closes the deck.',
        },
    },
]

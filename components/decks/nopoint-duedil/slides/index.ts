import type { SlideDefinition } from '../../types'
import { DuedilStubSlide } from './duedil-stub-slide'

interface DuedilSpec {
    id: string
    title: string
    pitchSlide: string
    chapter: string
    deeperGoals: string[]
    nailsThis: string
    storyThread: string
    whatItIsNot: string
}

const SPECS: DuedilSpec[] = [
    {
        id: 'title',
        title: 'Title',
        pitchSlide: 'Title',
        chapter: '00.0',
        deeperGoals: [
            'Reframe the company as a memorandum, not a pitch.',
            'Re-state confidentiality and intended audience.',
            'Anchor date, round, lead status.',
        ],
        nailsThis: 'Frames the rest of the document as a formal memorandum.',
        storyThread: 'Sets the tone for the deeper-dive sections that follow.',
        whatItIsNot: 'Not the pitch deck cover — this is for diligence.',
    },
    {
        id: 'problem',
        title: 'Problem',
        pitchSlide: 'Problem',
        chapter: '01.0',
        deeperGoals: [
            'Quote three customers describing the pain in their own words.',
            'Quantify cost per persona (hours/week, dollars/month).',
            'Show why incumbents have failed to fix it.',
        ],
        nailsThis: 'Grounds the rest of the document in a specific, measurable pain.',
        storyThread: 'Sets up the Solution chapter and the willingness-to-pay anchor.',
        whatItIsNot: 'Not the pitch-deck headline — this needs receipts and numbers.',
    },
    {
        id: 'solution',
        title: 'Solution',
        pitchSlide: 'Solution',
        chapter: '02.0',
        deeperGoals: [
            'Walk through one full user flow with annotated screenshots.',
            'Map each Problem-cost to a specific feature.',
            'Show what the product does NOT try to do.',
        ],
        nailsThis: 'Investor leaves knowing exactly what the product is and is not.',
        storyThread: 'Sets up the Product architecture and roadmap chapters.',
        whatItIsNot: 'Not feature laundry — focused on outcomes mapped to pain.',
    },
    {
        id: 'why-now',
        title: 'Why Now',
        pitchSlide: 'Why Now',
        chapter: '03.0',
        deeperGoals: [
            'Date each external shift with public sources.',
            'Address "why hasn\'t this been built before" head-on.',
            'Identify the specific window that closes if competitors move first.',
        ],
        nailsThis: 'Pins the wedge to dated, external shifts the partner can verify.',
        storyThread: 'Sets up Market — "and here is the pool that just opened."',
        whatItIsNot: 'Not a generic AI-trend slide.',
    },
    {
        id: 'product',
        title: 'Product',
        pitchSlide: 'Product',
        chapter: '04.0',
        deeperGoals: [
            'Architecture diagram + where the moats live (data, distribution, code).',
            'Quarterly roadmap with measurable outcomes per quarter.',
            'How the product will evolve as the team grows from 1 to 10.',
        ],
        nailsThis: 'Demonstrates technical seriousness without overwhelming the reader.',
        storyThread: 'Sets up Defensibility (in Why-We-Win) and Hiring Plan (in Team).',
        whatItIsNot: 'Not a wall of UI screenshots.',
    },
    {
        id: 'market',
        title: 'Market',
        pitchSlide: 'Market',
        chapter: '05.0',
        deeperGoals: [
            'TAM / SAM / SOM with bottom-up math the partner can verify.',
            '3–5 segments with size + willingness-to-pay + access path.',
            'Address "is this big enough" honestly before the partner asks.',
        ],
        nailsThis: 'Numbers the partner can re-derive from public data.',
        storyThread: 'Sets up Traction by stating the pool the funnel runs in.',
        whatItIsNot: 'Not an analyst-chart slide; not a vanity TAM flex.',
    },
    {
        id: 'traction',
        title: 'Traction',
        pitchSlide: 'Traction',
        chapter: '06.0',
        deeperGoals: [
            'Funnel cohorts: signups → activated → weekly-active → paid.',
            'Three named customer stories with use-case + outcome metric.',
            '90-day pipeline forecast — what the partner would see post-close.',
        ],
        nailsThis: 'Direction over absolute numbers; honest cohort retention.',
        storyThread: 'Sets up Business Model — "and here is how money flows".',
        whatItIsNot: 'Not a vanity-numbers slide.',
    },
    {
        id: 'landscape',
        title: 'Why We Win',
        pitchSlide: 'Why We Win',
        chapter: '07.0',
        deeperGoals: [
            'Honest 2x2 of competitors and adjacents.',
            'Defensibility: which moat compounds (data, distribution, switching cost, network).',
            'What happens if the largest incumbent tries to copy us?',
        ],
        nailsThis: 'Names a segment competitors implicitly de-prioritise and stakes it.',
        storyThread: 'Closes the "why us" arc; opens "how do you make money".',
        whatItIsNot: 'Not a dishonest comparison or "everyone else is bad".',
    },
    {
        id: 'business-model',
        title: 'Business Model',
        pitchSlide: 'Business Model',
        chapter: '08.0',
        deeperGoals: [
            'Pricing tiers tied to willingness-to-pay from the Problem chapter.',
            'CAC, LTV, payback period, gross margin per tier.',
            'Where pricing power compounds as scale grows.',
        ],
        nailsThis: 'Each price tier is a recoverable test, not a guess.',
        storyThread: 'Sets up Team — "the people who can execute on this model".',
        whatItIsNot: 'Not a placeholder pricing page.',
    },
    {
        id: 'team',
        title: 'Team',
        pitchSlide: 'Team',
        chapter: '09.0',
        deeperGoals: [
            'Founder bios with prior outcomes and earned secrets.',
            '12-month hiring plan with role + target month + why-this-hire-now.',
            'Existing investors and advisors with one-line value-prop per name.',
        ],
        nailsThis: 'Shows the team is the unfair advantage; demonstrates capacity planning.',
        storyThread: 'Final setup before Financials and the Ask.',
        whatItIsNot: 'Not a resume dump.',
    },
    {
        id: 'ask',
        title: 'Ask',
        pitchSlide: 'Ask',
        chapter: '10.0',
        deeperGoals: [
            'Round size, instrument, valuation, target close, lead status.',
            'Use-of-funds tied to specific milestones.',
            'Diligence checklist + data-room link + contact for follow-up.',
        ],
        nailsThis: 'States the cheque, the timeline, and removes friction from saying yes.',
        storyThread: 'Closes the document.',
        whatItIsNot: 'Not vague — every dollar tied to a milestone.',
    },
]

export const SLIDES: SlideDefinition[] = SPECS.map((s) => ({
    id: s.id,
    title: s.title,
    component: () =>
        DuedilStubSlide({
            pitchSlide: s.pitchSlide,
            chapter: s.chapter,
            deeperGoals: s.deeperGoals,
        }),
    context: {
        category: `Due Diligence · ${s.pitchSlide}`,
        principles: [
            'Memorandum, not pitch.',
            'Numbers and assumptions over narrative.',
            'Each claim has a citation in REFERENCES.md.',
        ],
        goals: s.deeperGoals,
        whatItIsNot: s.whatItIsNot,
        nailsThis: s.nailsThis,
        storyThread: s.storyThread,
    },
}))

import type { SlideDefinition } from '../../types'
import { CoverSlide } from './cover-slide'
import { ProblemSlide } from './problem-slide'
import { SolutionSlide } from './solution-slide'
import { MarketValidationSlide } from './market-validation-slide'
import { MarketSizeSlide } from './market-size-slide'
import { ProductSlide } from './product-slide'
import { BusinessModelSlide } from './business-model-slide'
import { MarketAdoptionSlide } from './market-adoption-slide'
import { CompetitionSlide } from './competition-slide'
import { CompetitiveAdvantagesSlide } from './competitive-advantages-slide'
import { TeamSlide } from './team-slide'
import { FinancialsSlide } from './financials-slide'
import { AskSlide } from './ask-slide'

export const SLIDES: SlideDefinition[] = [
    {
        id: 'cover',
        title: 'AirBed&Breakfast',
        component: CoverSlide,
        context: {
            category: 'Cover',
            principles: [
                'Tagline + domain in one screen.',
                'Imitate the original deck — cream paper, Rausch red, no ornament.',
            ],
            goals: [
                'Establish the company name and the one-line promise.',
                'Set the visual register for the deck (newspaper-clean, not glossy).',
            ],
            whatItIsNot: 'Not a logo wall or a feature collage.',
            nailsThis: 'Names the company, the tagline, the team, and the domain. Nothing else.',
            storyThread: 'Sets up the question every later slide answers: "why book a stranger\'s couch?"',
        },
    },
    {
        id: 'problem',
        title: 'Problem',
        component: ProblemSlide,
        context: {
            category: 'Problem',
            principles: [
                'Three pains, one each per column.',
                'Each pain becomes a benefit on the next slide.',
            ],
            goals: [
                'State the three failures of online travel booking circa 2009.',
                'Set up Solution to mirror them benefit-for-pain.',
            ],
            whatItIsNot: 'Not a generic "travel is broken" rant.',
            nailsThis: 'Price, sterility, no peer-to-peer transactions — three concrete pains.',
            storyThread: 'Each pain reappears as a Solution benefit on the next slide.',
        },
    },
    {
        id: 'solution',
        title: 'Solution',
        component: SolutionSlide,
        context: {
            category: 'Solution',
            principles: ['Headline names the artifact.', 'Three benefits, mirrored to the three pains.'],
            goals: [
                'Resolve each Problem-slide pain.',
                'Frame the platform as two-sided from the start.',
            ],
            whatItIsNot: 'Not a deep product walkthrough.',
            nailsThis: 'Save / Make / Share — three verbs that close the loop on the three pains.',
            storyThread: 'Sets up "is anyone actually doing this?" — answered by Market Validation.',
        },
    },
    {
        id: 'market-validation',
        title: 'Market Validation',
        component: MarketValidationSlide,
        context: {
            category: 'Market Validation',
            principles: ['Show the demand already exists informally.', 'Cite specific data sources.'],
            goals: [
                'Prove informal markets exist (Couchsurfing, Craigslist) at meaningful scale.',
                'Justify the wedge: a transactional layer for behavior people already do.',
            ],
            whatItIsNot: 'Not a TAM flex; not a survey result.',
            nailsThis: 'Two specific 2008 datasets that show people already book each other\'s rooms.',
            storyThread: 'If informal markets are this big, formalising them is the obvious move.',
        },
    },
    {
        id: 'market-size',
        title: 'Market Size',
        component: MarketSizeSlide,
        context: {
            category: 'Market Size',
            principles: ['Funnel: total → online → us.', 'A 2% slice is enough.'],
            goals: [
                'Show the ladder from 1.9B trips to a 10.6M beachhead.',
                'Make the 2% target feel small and reachable.',
            ],
            whatItIsNot: 'Not a top-down TAM/SAM/SOM hand-wave.',
            nailsThis: '2% of online travel is a $200M business. Says it plainly, in three numbers.',
            storyThread: 'Sets up "what does the product look like?" — answered next.',
        },
    },
    {
        id: 'product',
        title: 'Product',
        component: ProductSlide,
        context: {
            category: 'Product',
            principles: ['Three steps. No more.', 'Already shipped.'],
            goals: [
                'Walk through search → list → book in one screen.',
                'Establish that the product exists today, not a roadmap.',
            ],
            whatItIsNot: 'Not a feature laundry list.',
            nailsThis: 'Three numbered cards that read as a flow, plus "live since August 2008."',
            storyThread: 'Sets up "how does this make money?" — answered next.',
        },
    },
    {
        id: 'business-model',
        title: 'Business Model',
        component: BusinessModelSlide,
        context: {
            category: 'Business Model',
            principles: ['Show the math, end-to-end.', 'One unit economic per card.'],
            goals: [
                'Make the 10% commission feel modest and the math obvious.',
                'Connect unit economics to the $200M revenue claim from Market Size.',
            ],
            whatItIsNot: 'Not a discount/coupon plan or a pricing table.',
            nailsThis: 'Booking → take rate → revenue, then multiplies up to the $200M figure.',
            storyThread: 'Sets up "how do you grow into 84M bookings?" — answered next.',
        },
    },
    {
        id: 'market-adoption',
        title: 'Market Adoption',
        component: MarketAdoptionSlide,
        context: {
            category: 'Market Adoption',
            principles: ['Repeatable wedge: events with hotel shortages.', 'Dated proof points.'],
            goals: [
                'Show a repeatable acquisition pattern.',
                'Anchor it in real, dated launches (SXSW, DNC, RNC, ETech).',
            ],
            whatItIsNot: 'Not a "we will do PR" hand-wave.',
            nailsThis: 'Four dated event-driven launches; each is a copyable playbook.',
            storyThread: 'Sets up "but isn\'t this crowded?" — answered by Competition.',
        },
    },
    {
        id: 'competition',
        title: 'Competition',
        component: CompetitionSlide,
        context: {
            category: 'Competition',
            principles: ['2x2 with the empty quadrant claimed.', 'Name real competitors.'],
            goals: [
                'Position against Couchsurfing, Craigslist, Hostels.com, Hotels.com on real axes.',
                'Make the empty-quadrant claim visible without saying "we have no competition."',
            ],
            whatItIsNot: 'Not a strawman chart.',
            nailsThis: 'Affordability vs online transactions — and only AirBed&Breakfast lives top-right.',
            storyThread: 'Sets up the feature-by-feature comparison on the next slide.',
        },
    },
    {
        id: 'competitive-advantages',
        title: 'Competitive Advantages',
        component: CompetitiveAdvantagesSlide,
        context: {
            category: 'Competitive Advantages',
            principles: ['Comparison matrix.', 'AirBed&Breakfast checks every box.'],
            goals: [
                'Translate the 2x2 into a discrete feature checklist.',
                'Reinforce that the empty quadrant is real and earned.',
            ],
            whatItIsNot: 'Not a technology moat slide.',
            nailsThis: 'Five competitors × four features. Only the last column is fully checked.',
            storyThread: 'Closes the "why us" arc; opens "who is us?" — Team next.',
        },
    },
    {
        id: 'team',
        title: 'Team',
        component: TeamSlide,
        context: {
            category: 'Team',
            principles: ['Three faces, three roles, three sentences.', 'Why these specific people.'],
            goals: [
                'Show the founders without LinkedIn ornament.',
                'Tie each role to a specific function: vision, experience, engineering.',
            ],
            whatItIsNot: 'Not an advisor logo wall.',
            nailsThis: 'Two designers + an engineer; each has one verb attached.',
            storyThread: 'Final setup before the numbers. Investor asks: "do they have the chops?"',
        },
    },
    {
        id: 'financials',
        title: 'Financials',
        component: FinancialsSlide,
        context: {
            category: 'Financials',
            principles: ['Three years, one bar each.', 'Revenue first, costs absent — by design.'],
            goals: [
                'Anchor the trajectory: $5M → $50M → $200M.',
                'Make the path feel proportional, not exponential-magic.',
            ],
            whatItIsNot: 'Not a P&L statement; not a cohort chart.',
            nailsThis: 'Three bars, three captions. The 2009 deck did not show costs and neither do we.',
            storyThread: 'Sets up the Ask: how much, for what.',
        },
    },
    {
        id: 'ask',
        title: 'The Ask',
        component: AskSlide,
        context: {
            category: 'Ask',
            principles: ['Round size, equity, runway, use of funds.', 'No new arguments after this.'],
            goals: [
                'State the cheque clearly.',
                'Show what 12 months of $500K buys: 80,000 cumulative bookings.',
            ],
            whatItIsNot: 'Not a "let\'s chat" closer.',
            nailsThis: '$500K · 11% · 12 months · four buckets of spend.',
            storyThread: 'Closes the deck. Anything after this is contact info.',
        },
    },
]

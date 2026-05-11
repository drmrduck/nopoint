import type { SlideDefinition } from '../../types'
import { CoverSlide } from './cover-slide'
import { TractionSlide } from './traction-slide'
import { SocialTrendSlide } from './social-trend-slide'
import { MarketSlide } from './market-slide'
import { ProductSlide } from './product-slide'
import { QueueSlide } from './queue-slide'
import { QuestionSlide } from './question-slide'
import { BusinessModelSlide } from './business-model-slide'
import { WhyWeWinSlide } from './why-we-win-slide'
import { RoadmapSlide } from './roadmap-slide'
import { TeamSlide } from './team-slide'
import { SocialProofSlide } from './social-proof-slide'
import { AskSlide } from './ask-slide'

// Order matches the original Buffer 2013 deck — 13 slides exactly.
// 1 Cover · 2 Social trend · 3 Traffic question · 4 Queue · 5 Traction
// 6 Milestones · 7 Business model · 8 Social media landscape
// 9 Effect of Buffering · 10 Sharing standard · 11 Competitive landscape
// 12 Team · 13 Ask
export const SLIDES: SlideDefinition[] = [
    {
        id: 'cover',
        title: 'Buffer',
        component: CoverSlide,
        context: {
            category: 'Cover',
            principles: [
                'Wordmark + one-line product description.',
                'Buffer green + cream paper. No ornament.',
            ],
            goals: [
                'State the company name and what it does in five seconds.',
                'Establish the visual register — calm, professional, profitable.',
            ],
            whatItIsNot: 'Not a vision statement.',
            nailsThis: 'Logo, tagline, founders, ask preview. Done.',
            storyThread: 'Sets up slide 2 — why social is the trend that matters now.',
        },
    },
    {
        id: 'social-trend',
        title: 'Social, the most important trend',
        component: SocialTrendSlide,
        context: {
            category: 'Why Now',
            principles: [
                'Borrow authority from a primary source — quote the operators, not the analysts.',
                'Cream paper + giant page-watermark = visual continuity with the original Buffer 2013 deck.',
            ],
            goals: [
                'Make the "social is the trend" case in two quotes — Zuckerberg on sharing volume, Donanza on SMM > SEO.',
                'Use a recognisable photo (Zuckerberg + the Engagement chart) so the claim lands without a chart of our own.',
            ],
            whatItIsNot: 'Not a market-size slide; not a TAM number.',
            nailsThis: 'Two pull-quotes flank a single photo of the Engagement chart talk. Page-26 watermark anchors it as a faithful recreation.',
            storyThread: 'Opens the deck after the cover. Hands off to the traffic question on slide 3.',
        },
    },
    {
        id: 'traffic-question',
        title: 'How do you use social to drive traffic?',
        component: QuestionSlide,
        context: {
            category: 'Pivot',
            principles: [
                'Black slide, white type. The deck stops and asks.',
                'No body, no bullets — the question is the slide.',
            ],
            goals: [
                'Force the room to hold the question for one beat.',
                'Frame everything that follows (Queue, Traction, Milestones) as the answer.',
            ],
            whatItIsNot: 'Not a section divider with a label; the question is the content.',
            nailsThis: 'A single sentence in white on black, centered, max-width clamped so it breaks like the original.',
            storyThread: 'Picks up the social-is-the-trend thesis and sets up slide 4: the queue is how Buffer answers it.',
        },
    },
    {
        id: 'queue',
        title: 'Queue your updates',
        component: QueueSlide,
        context: {
            category: 'Product',
            principles: [
                'Show the actual product, not a feature list.',
                'Let the screenshot speak — title + UI + wordmark, nothing else.',
            ],
            goals: [
                'Answer slide 3\'s question by showing the queue UI.',
                'Make the "one queue" promise feel tangible before any numbers.',
            ],
            whatItIsNot: 'Not a feature tour; not annotated; no callouts.',
            nailsThis: 'Faithful recreation of the original 2013 deck slide — giant headline, queue panel, buffer wordmark.',
            storyThread: 'Answers slide 3. Hands off to Traction — the queue is working, here are the numbers.',
        },
    },
    {
        id: 'traction',
        title: 'Traction',
        component: TractionSlide,
        context: {
            category: 'Traction',
            principles: ['Lead with the numbers.', 'Up-and-to-the-right with no axis tricks.'],
            goals: [
                'Establish the strongest signal: 800 paying users, $150K ARR, 97% margins, profitable.',
                'Make every later slide read as elaboration of "we already work."',
            ],
            whatItIsNot: 'Not a single hero metric; show the funnel.',
            nailsThis: 'Big numbers + a sparkline of monthly revenue. Eleven months, all green.',
            storyThread: 'Sets up Milestones — these numbers came from a list of past wins.',
        },
    },
    {
        id: 'milestones',
        title: 'Milestones',
        component: RoadmapSlide,
        context: {
            category: 'Milestones',
            principles: [
                'Past wins, not future plans.',
                'Every line carries a number — users, revenue, integrations.',
            ],
            goals: [
                'Show the cadence of shipping: launched, scaled, integrated, hit 100K, hit 1M updates buffered.',
                'Convert the traction headline numbers into a chronological story.',
            ],
            whatItIsNot: 'Not a roadmap of future features; this slide is achievements only.',
            nailsThis: 'Five-or-six dash bullets, each with a metric attached. Reads like a changelog.',
            storyThread: 'Picks up Traction (the topline) by showing the path that produced it. Hands off to Business Model.',
        },
    },
    {
        id: 'business-model',
        title: 'Business Model',
        component: BusinessModelSlide,
        context: {
            category: 'Business Model',
            principles: ['Freemium with a flat conversion.', 'One sentence per pricing fact.'],
            goals: [
                'Show pricing simply, with the 2% conversion that makes it work.',
                'Tie the model back to the $3.6M projection at 1M users.',
            ],
            whatItIsNot: 'Not a feature-by-feature pricing table.',
            nailsThis: 'Freemium · 2% conversion · $240 LTV · $5 → $50 upgrade arc.',
            storyThread: 'Sets up Social Media Landscape — given this model, how big is the underlying behaviour?',
        },
    },
    {
        id: 'social-media-landscape',
        title: 'Social Media Landscape',
        component: MarketSlide,
        context: {
            category: 'Market',
            principles: ['Three numbers.', 'Each tied to a single sentence of interpretation.'],
            goals: [
                'Anchor the volume of sharing: 200M daily Tweets, 4B Facebook items per day.',
                'Show that traffic from social is on track to surpass search.',
            ],
            whatItIsNot: 'Not a TAM/SAM/SOM stack.',
            nailsThis: 'Three landscape facts, ordered by velocity, with Zuckerberg\'s law as the through-line.',
            storyThread: 'Sets up The Effect of Buffering — given the landscape, what does Buffer specifically do to it?',
        },
    },
    {
        id: 'effect-of-buffering',
        title: 'The effect of Buffering',
        component: SocialProofSlide,
        context: {
            category: 'Social Proof',
            principles: ['One headline quote.', 'Source logo, nothing else.'],
            goals: [
                'Land the ReadWriteWeb claim: "Buffer Finds Tweet Scheduling Can Increase Clicks by 200%."',
                'Make the impact visceral with a single press citation, not a wall of logos.',
            ],
            whatItIsNot: 'Not an "as seen in" press wall.',
            nailsThis: 'Pull-quote front and center, ReadWriteWeb wordmark beneath. That\'s the slide.',
            storyThread: 'Picks up the landscape (slide 8) by showing what Buffer measurably does to it. Hands off to A Sharing Standard.',
        },
    },
    {
        id: 'sharing-standard',
        title: 'A sharing standard',
        component: ProductSlide,
        context: {
            category: 'Product',
            principles: ['Distribution > features.', 'Show the integration count, not a logo cloud.'],
            goals: [
                'Establish that Buffer is showing up as the default sharing button across third-party apps.',
                'List the integrations (Reeder, Pocket, Feedly, …) that already ship with Buffer built in.',
            ],
            whatItIsNot: 'Not a UI walkthrough.',
            nailsThis: '8 integrations · in talks with Reeder, Pocket, Feedly · plan to become the default.',
            storyThread: 'Sets up Competitive Landscape — if we\'re the standard, who else is in the room?',
        },
    },
    {
        id: 'competitive-landscape',
        title: 'Competitive Landscape',
        component: WhyWeWinSlide,
        context: {
            category: 'Competition',
            principles: ['Logo cluster, not a feature matrix.', 'Position Buffer relative to giants without claiming we beat them on every axis.'],
            goals: [
                'Show the surrounding ecosystem — Twitter clients, Facebook, LinkedIn, Hootsuite, etc.',
                'Make the case that Buffer occupies a slot none of them are filling: the queue.',
            ],
            whatItIsNot: 'Not a four-quadrant magic chart.',
            nailsThis: 'A logo cluster around the Buffer mark, with the wedge labelled.',
            storyThread: 'Sets up Team — the people who are going to keep the wedge open.',
        },
    },
    {
        id: 'team',
        title: 'Team',
        component: TeamSlide,
        context: {
            category: 'Team',
            principles: [
                'Replicates the 2013 Buffer deck team slide exactly.',
                'Founders first, then advisors and existing investors stacked on the same page.',
            ],
            goals: [
                'Name the two co-founders with a single green-text credential each.',
                'Show the advisor bench and the seed-stage investor logos.',
            ],
            whatItIsNot: 'Not a roles-and-responsibilities table; not a values manifesto.',
            nailsThis: 'Joel + Leo with green blurbs up top, two columns below: Advisors and Previous Investors. Linen paper background with faded ghost silhouettes — the original look.',
            storyThread: 'Closes the body of the deck. Hands off to The Ask.',
        },
    },
    {
        id: 'ask',
        title: 'The Ask',
        component: AskSlide,
        context: {
            category: 'Ask',
            principles: ['Round size, structure, runway, use of funds.', 'No new arguments.'],
            goals: [
                'State the cheque clearly: $500K convertible note, $4M cap.',
                'Show what 12 months of $500K buys: two engineers + channel experiments.',
            ],
            whatItIsNot: 'Not a "let\'s chat" closer.',
            nailsThis: '$500K · $4M cap · four buckets of spend.',
            storyThread: 'Closes the deck. Anything after this is contact info.',
        },
    },
]

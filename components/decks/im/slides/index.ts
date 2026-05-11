import type { SlideDefinition } from '../../types'
import { SectionSlide } from './section-slide'

interface IMSlideSpec {
    id: string
    title: string
    section: string
    chapter: string
    body: string
    bullets?: string[]
    nailsThis: string
    storyThread: string
}

const SPECS: IMSlideSpec[] = [
    // Executive summary
    { id: 'cover', title: 'Information Memorandum', section: 'Front Matter', chapter: '00.0', body: 'Cover page: company name, "Information Memorandum", round, date, "Strictly Confidential" footer.', nailsThis: 'Positions the document as a formal memorandum, not a pitch.', storyThread: 'Sets the tone for the rest of the deck.' },
    { id: 'executive-summary', title: 'Executive Summary', section: 'Front Matter', chapter: '00.1', body: 'One-page summary the partner can use to brief their committee. Headline + 5 bullets + the Ask number.', nailsThis: 'Distills the whole IM to a single page that survives forwarding.', storyThread: 'Promises specifics; the rest of the IM delivers them.' },
    { id: 'disclaimer', title: 'Disclaimer & Assumptions', section: 'Front Matter', chapter: '00.2', body: 'Standard offer-document language. Forward-looking statements; no guarantee of future performance. Reviewed by counsel before send.', nailsThis: 'Keeps the document defensible.', storyThread: 'Allows the rest of the document to be specific without legal risk.' },

    // Section 1: Problem & Solution
    { id: 'problem-overview', title: 'The Problem', section: 'Problem & Solution', chapter: '01.1', body: 'Customer pain in three paragraphs. Quote one customer per paragraph.', nailsThis: 'Grounds the rest of the doc in a specific customer.', storyThread: 'Sets up the Solution chapter.' },
    { id: 'problem-quantification', title: 'Quantifying the Pain', section: 'Problem & Solution', chapter: '01.2', body: 'Hours-per-week, dollars-per-month, deals-lost. Numbers per persona.', nailsThis: 'Turns the abstract pain into a willingness-to-pay anchor.', storyThread: 'Justifies the price point on the Pricing chapter.' },
    { id: 'solution-overview', title: 'Our Approach', section: 'Problem & Solution', chapter: '01.3', body: 'How the product solves the problem. One paragraph per Problem-quantification row.', nailsThis: 'Maps each cost above to a feature below.', storyThread: 'Sets up the Product chapter.' },

    // Section 2: Market
    { id: 'market-tam', title: 'TAM / SAM / SOM', section: 'Market', chapter: '02.1', body: 'Bottom-up. Customers × price = revenue. Show the calculation transparently.', nailsThis: 'Lets the partner verify the math before the meeting.', storyThread: 'Sizes the prize the rest of the doc justifies.' },
    { id: 'market-segments', title: 'Customer Segments', section: 'Market', chapter: '02.2', body: 'Three to five segments, each with size + willingness-to-pay + access path.', nailsThis: 'Shows the founder knows where the dollars actually live.', storyThread: 'Sets up the GTM chapter.' },
    { id: 'market-trends', title: 'Why Now', section: 'Market', chapter: '02.3', body: 'Three external shifts within the last 24 months. Date-stamped.', nailsThis: 'Pins the wedge to recent shifts.', storyThread: 'Earns the right to ask "why hasn\'t this been built before?"' },

    // Section 3: Product
    { id: 'product-overview', title: 'Product Overview', section: 'Product', chapter: '03.1', body: 'Live screenshot or rendered slide. Walk through one full user flow.', nailsThis: 'Investor leaves knowing exactly what the product does.', storyThread: 'Sets up the architecture and roadmap chapters.' },
    { id: 'product-architecture', title: 'Architecture', section: 'Product', chapter: '03.2', body: 'How it is built. Where the moats live (data, distribution, code).', nailsThis: 'Shows technical seriousness without overwhelming the reader.', storyThread: 'Sets up Defensibility.' },
    { id: 'product-roadmap', title: 'Roadmap (next 18 months)', section: 'Product', chapter: '03.3', body: 'Quarterly milestones. Each quarter has a measurable outcome, not a feature list.', nailsThis: 'Demonstrates the team plans in outcomes.', storyThread: 'Justifies the runway in the Financials chapter.' },

    // Section 4: GTM
    { id: 'gtm-strategy', title: 'GTM Strategy', section: 'Go-to-Market', chapter: '04.1', body: 'Top of funnel: how customers find us. Middle: how they convert. Bottom: how they expand.', nailsThis: 'Shows a concrete acquisition theory, not "we will do content."', storyThread: 'Sets up Traction.' },
    { id: 'gtm-channels', title: 'Channels & CAC', section: 'Go-to-Market', chapter: '04.2', body: 'Channel-by-channel CAC + payback period. Mark which are tested vs. hypothesised.', nailsThis: 'Honest about which channels are proven.', storyThread: 'Sets up the financial model.' },

    // Section 5: Traction
    { id: 'traction-funnel', title: 'Funnel & Cohorts', section: 'Traction', chapter: '05.1', body: 'Signups → activated → weekly-active → paid. Cohort retention curves.', nailsThis: 'Direction over absolute numbers.', storyThread: 'Sets up Customers.' },
    { id: 'traction-customers', title: 'Customer Stories', section: 'Traction', chapter: '05.2', body: 'Three named customers. Use case + outcome metric per story.', nailsThis: 'Ties the funnel to specific people who pay.', storyThread: 'Sets up Pipeline.' },
    { id: 'traction-pipeline', title: 'Pipeline', section: 'Traction', chapter: '05.3', body: 'Top of funnel for the next 90 days. Shows what an investor would see post-close.', nailsThis: 'Forward-looking but provable.', storyThread: 'Sets up the Business Model chapter.' },

    // Section 6: Business Model
    { id: 'pricing', title: 'Pricing', section: 'Business Model', chapter: '06.1', body: 'Tiers, price points, upgrade triggers. Tied back to willingness-to-pay from chapter 01.2.', nailsThis: 'Each price is a recoverable test.', storyThread: 'Sets up Unit Economics.' },
    { id: 'unit-economics', title: 'Unit Economics', section: 'Business Model', chapter: '06.2', body: 'CAC, LTV, payback period, gross margin. Per-tier breakdown.', nailsThis: 'Shows the math is investor-grade, not founder-grade.', storyThread: 'Justifies the financial model.' },

    // Section 7: Competition
    { id: 'competitive-landscape', title: 'Competitive Landscape', section: 'Competition', chapter: '07.1', body: 'Honest list of competitors and adjacents. 2x2 matrix on the dimensions that matter.', nailsThis: 'Shows the empty quadrant.', storyThread: 'Sets up Defensibility.' },
    { id: 'defensibility', title: 'Defensibility', section: 'Competition', chapter: '07.2', body: 'Why the moat compounds: data, distribution, switching cost, network effect.', nailsThis: 'Names which moat applies, not all four.', storyThread: 'Closes the "why us" arc.' },

    // Section 8: Team
    { id: 'team-bios', title: 'Founders', section: 'Team', chapter: '08.1', body: 'Each founder: name, role, prior outcome, earned secret. One verb per founder.', nailsThis: 'Shows the team is the unfair advantage.', storyThread: 'Sets up Hiring Plan.' },
    { id: 'team-hiring-plan', title: 'Hiring Plan', section: 'Team', chapter: '08.2', body: '12-month hire list with role, target month, why-this-hire-now.', nailsThis: 'Demonstrates the team plans for capacity, not headcount.', storyThread: 'Justifies the use-of-funds.' },
    { id: 'team-advisors', title: 'Advisors & Investors', section: 'Team', chapter: '08.3', body: 'Existing investors and advisors with one-line value-prop per name.', nailsThis: 'Social proof without name-dropping.', storyThread: 'Sets up the round.' },

    // Section 9: Financials
    { id: 'financials-historical', title: 'Historical Performance', section: 'Financials', chapter: '09.1', body: 'Last 12 months: revenue, expenses, headcount, customer count. Monthly granularity.', nailsThis: 'Honest history.', storyThread: 'Sets up Projections.' },
    { id: 'financials-projections', title: '18-Month Projections', section: 'Financials', chapter: '09.2', body: 'Best/base/worst case. Sensitivity to the top three drivers.', nailsThis: 'Bands instead of single-line forecasts.', storyThread: 'Justifies the round size.' },
    { id: 'use-of-funds', title: 'Use of Funds', section: 'Financials', chapter: '09.3', body: 'Where the round goes: headcount, infra, GTM, runway buffer.', nailsThis: 'Each dollar tied to a milestone.', storyThread: 'Sets up the Ask.' },

    // Section 10: Risk
    { id: 'risk-factors', title: 'Risk Factors', section: 'Risk & Compliance', chapter: '10.1', body: 'Top three risks and mitigations. Honest, not exhaustive.', nailsThis: 'Shows the team has thought about what could break.', storyThread: 'Pre-empts diligence questions.' },
    { id: 'compliance', title: 'Compliance & Legal', section: 'Risk & Compliance', chapter: '10.2', body: 'Entity structure, IP ownership, key agreements, regulatory exposure.', nailsThis: 'Pre-empts legal-side diligence.', storyThread: 'Closes the documentation requirements.' },

    // Section 11: The Ask
    { id: 'the-ask', title: 'The Ask', section: 'The Ask', chapter: '11.1', body: 'Round size, instrument, valuation, target close, lead status.', nailsThis: 'States the cheque and the timeline unambiguously.', storyThread: 'Closes the IM.' },
    { id: 'next-steps', title: 'Next Steps', section: 'The Ask', chapter: '11.2', body: 'Diligence checklist + data-room link + contact for follow-up.', nailsThis: 'Removes friction from saying yes.', storyThread: 'End of document.' },
]

export const SLIDES: SlideDefinition[] = SPECS.map((s) => ({
    id: s.id,
    title: s.title,
    component: () =>
        SectionSlide({
            section: s.section,
            chapter: s.chapter,
            title: s.title,
            body: s.body,
            bullets: s.bullets,
        }),
    context: {
        category: s.section,
        principles: ['Memorandum, not pitch.', 'Numbers > narrative.', 'Receipts in REFERENCES.md.'],
        nailsThis: s.nailsThis,
        storyThread: s.storyThread,
    },
}))

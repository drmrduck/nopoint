import type { SlideDefinition } from '../../types'
import { TitleSlide } from './title-slide'
import { ProblemSlide } from './problem-slide'
import { MetricsSlide } from './metrics-slide'
import { CustomersSlide } from './customers-slide'
import { IncidentsSlide } from './incidents-slide'
import { QuotesSlide } from './quotes-slide'
import { CtaSlide } from './cta-slide'

export type { SlideDefinition } from '../../types'

export const SLIDES: SlideDefinition[] = [
    { id: 'title', title: 'Title', component: TitleSlide },
    { id: 'problem', title: 'The Situation', component: ProblemSlide },
    { id: 'metrics', title: 'Coffee and Pie Ops', component: MetricsSlide },
    { id: 'customers', title: 'Customer Mix', component: CustomersSlide },
    { id: 'incidents', title: 'Incident Policy', component: IncidentsSlide },
    { id: 'quotes', title: 'Town Feedback', component: QuotesSlide },
    { id: 'cta', title: 'Takeaway', component: CtaSlide },
]

import type { SlideDefinition } from '../../types'
import { TitleSlide } from './title-slide'
import { ProblemSlide } from './problem-slide'
import { SolutionSlide } from './solution-slide'
import { IntegrationsSlide } from './integrations-slide'
import { QuotesSlide } from './quotes-slide'
import { DemoSlide } from './demo-slide'
import { CtaSlide } from './cta-slide'

export type { SlideDefinition } from '../../types'

export const SLIDES: SlideDefinition[] = [
    { id: 'title', title: 'Title', component: TitleSlide },
    { id: 'problem', title: 'Problem', component: ProblemSlide },
    { id: 'solution', title: 'Product', component: SolutionSlide },
    { id: 'integrations', title: 'Integrazzioni', component: IntegrationsSlide },
    { id: 'quotes', title: 'Voice of Sergio', component: QuotesSlide },
    { id: 'demo', title: 'Pulse Demo', component: DemoSlide },
    { id: 'cta', title: 'FAQ and CTA', component: CtaSlide },
]

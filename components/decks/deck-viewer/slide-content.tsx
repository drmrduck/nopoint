import { createElement } from 'react'
import type { SlideDefinition } from '../types'
import { resolveSlideComponent } from './utils'

export function SlideContent({
    slide,
    variantKey,
}: {
    slide: SlideDefinition
    variantKey: string | undefined
}) {
    return createElement(resolveSlideComponent(slide, variantKey))
}

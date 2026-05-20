import type { SlideDefinition } from '../types'
import { ScaledThumb } from '../scaled-stage'
import { SlideContent } from './slide-content'

export function ScrollView({
    orderedEnabled,
    slideMap,
    variantChoices,
    onPick,
}: {
    orderedEnabled: string[]
    slideMap: Record<string, SlideDefinition>
    variantChoices: Record<string, string>
    onPick: (idx: number) => void
}) {
    return (
        <div className="absolute inset-0 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">
                {orderedEnabled.map((id, i) => {
                    const slide = slideMap[id]
                    if (!slide) return null
                    const variantKey = variantChoices[id] ?? slide.defaultVariant
                    return (
                        <button
                            key={id}
                            onDoubleClick={() => onPick(i)}
                            className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors text-left"
                            style={{ aspectRatio: '16 / 9' }}
                        >
                            <ScaledThumb>
                                <SlideContent slide={slide} variantKey={variantKey} />
                            </ScaledThumb>
                            <div className="absolute top-3 left-3 text-xs font-semibold bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5 text-white/80 tabular-nums">
                                {i + 1} — {slide.title}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

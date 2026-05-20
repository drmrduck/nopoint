import type { SlideDefinition } from '../types'
import { ScaledThumb } from '../scaled-stage'
import { SlideContent } from './slide-content'

export function GridView({
    orderedEnabled,
    slideMap,
    variantChoices,
    currentIdx,
    onPick,
}: {
    orderedEnabled: string[]
    slideMap: Record<string, SlideDefinition>
    variantChoices: Record<string, string>
    currentIdx: number
    onPick: (idx: number) => void
}) {
    return (
        <div className="absolute inset-0 overflow-y-auto p-6 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {orderedEnabled.map((id, i) => {
                    const slide = slideMap[id]
                    if (!slide) return null
                    const variantKey = variantChoices[id] ?? slide.defaultVariant
                    return (
                        <button
                            key={id}
                            onClick={() => onPick(i)}
                            className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                                i === currentIdx
                                    ? 'border-blue-500 shadow-xl shadow-blue-500/20'
                                    : 'border-white/10 hover:border-white/30'
                            }`}
                        >
                            <ScaledThumb>
                                <SlideContent slide={slide} variantKey={variantKey} />
                            </ScaledThumb>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                <p className="text-xs text-white/40 tabular-nums">{i + 1}</p>
                                <p className="text-sm text-white font-medium truncate">{slide.title}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

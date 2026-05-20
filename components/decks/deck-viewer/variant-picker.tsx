import type { SlideVariant } from '../types'

export function VariantPicker({
    variants,
    current,
    onPick,
}: {
    variants: Record<string, SlideVariant>
    current: string | undefined
    onPick: (key: string) => void
}) {
    const entries = Object.entries(variants)
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <div className="flex items-center bg-zinc-900/95 border border-white/10 rounded-lg overflow-hidden shadow-xl">
                <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider px-3">
                    Variant
                </span>
                {entries.map(([key, variant]) => (
                    <button
                        key={key}
                        onClick={() => onPick(key)}
                        className={`px-3 h-8 text-xs font-medium transition-colors ${
                            current === key
                                ? 'bg-blue-500/30 text-blue-200'
                                : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

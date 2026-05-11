interface Props {
    pitchSlide: string
    chapter: string
    deeperGoals: string[]
}

export function DuedilStubSlide({ pitchSlide, chapter, deeperGoals }: Props) {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex h-full w-full px-20 py-16 relative z-10">
                <div className="w-44 shrink-0">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-300/70 mb-1">
                        Due Diligence
                    </p>
                    <p className="text-xs text-white/30 font-mono">{chapter}</p>
                </div>
                <div className="flex-1 max-w-4xl border-l border-white/8 pl-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400/70 mb-3">
                        Deeper dive · {pitchSlide}
                    </p>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-8">
                        TODO — expand the {pitchSlide} slide for diligence.
                    </h2>
                    <p className="text-base text-white/45 leading-relaxed mb-8 max-w-2xl">
                        This deck mirrors the NoPoint pitch deck&apos;s 11 slides, but each is reserved
                        for the deeper version a partner reads after a positive first meeting.
                        Replace this stub with the real content when the deck is needed.
                    </p>

                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35 mb-3">
                        What this slide should cover
                    </p>
                    <ul className="space-y-2 max-w-2xl">
                        {deeperGoals.map((g) => (
                            <li key={g} className="flex items-start gap-2.5 text-base text-white/65 leading-relaxed">
                                <span className="text-indigo-400/60 mt-1.5">·</span>
                                <span>{g}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-widest text-yellow-300/40">
                Stub · fill before sending
            </div>
        </div>
    )
}

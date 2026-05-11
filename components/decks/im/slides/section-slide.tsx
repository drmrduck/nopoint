interface Props {
    section: string
    chapter: string
    title: string
    body: string
    bullets?: string[]
}

export function SectionSlide({ section, chapter, title, body, bullets }: Props) {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex h-full w-full px-20 py-16 relative z-10">
                <div className="w-44 shrink-0">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-300/70 mb-1">
                        {section}
                    </p>
                    <p className="text-xs text-white/30 font-mono">{chapter}</p>
                </div>
                <div className="flex-1 max-w-4xl border-l border-white/8 pl-12">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-6">{title}</h2>
                    <p className="text-lg text-white/55 leading-relaxed mb-8 max-w-3xl">{body}</p>
                    {bullets && bullets.length > 0 && (
                        <ul className="space-y-3 max-w-3xl">
                            {bullets.map((b) => (
                                <li
                                    key={b}
                                    className="text-base text-white/65 leading-relaxed flex gap-3"
                                >
                                    <span className="text-indigo-400/60 mt-2">·</span>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-widest text-white/15">
                IM Template — replace this stub
            </div>
        </div>
    )
}

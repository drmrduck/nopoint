interface Props {
    title: string
    subtitle: string
    helper: string
}

export function PlaceholderSlide({ title, subtitle, helper }: Props) {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/4 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col justify-center px-20 max-w-5xl relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
                    {subtitle}
                </p>
                <h2 className="text-5xl font-bold text-white tracking-tight mb-6">{title}</h2>
                <p className="text-lg text-white/45 leading-relaxed max-w-3xl">{helper}</p>
                <div className="mt-12 inline-flex items-center gap-2 w-fit rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-emerald-300/80">
                    Sequoia template — replace this stub
                </div>
            </div>
        </div>
    )
}

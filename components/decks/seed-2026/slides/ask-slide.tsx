const FACTS = [
    { label: 'Runway', value: '18 months' },
    { label: 'Milestone', value: '75 paying teams' },
    { label: 'Next round', value: 'Series A · 2027' },
]

const USE = [
    { pct: '60%', bucket: 'Engineering' },
    { pct: '25%', bucket: 'GTM' },
    { pct: '15%', bucket: 'Operations' },
]

export function AskSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/6 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Ask
                </p>
                <h2 className="font-headline text-8xl font-bold text-white tracking-tight leading-tight mb-12">
                    Raising <span className="text-blue-400">$1.5M</span>
                </h2>

                <div className="grid grid-cols-3 gap-12 max-w-4xl mb-14">
                    {FACTS.map((m) => (
                        <div key={m.label}>
                            <p className="text-sm uppercase tracking-[0.22em] text-white/40 mb-2">
                                {m.label}
                            </p>
                            <p className="text-2xl font-semibold text-white">
                                {m.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-12 max-w-4xl">
                    {USE.map((u) => (
                        <div key={u.bucket}>
                            <p className="text-4xl font-bold text-white tabular-nums mb-2">
                                {u.pct}
                            </p>
                            <p className="text-lg text-white/60">{u.bucket}</p>
                        </div>
                    ))}
                </div>

                <p className="text-lg text-white/45 mt-14">
                    drummerduck.com · let&apos;s talk.
                </p>
            </div>
        </div>
    )
}

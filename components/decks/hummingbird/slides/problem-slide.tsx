const COSTS = [
    { stat: '2 weeks', label: 'Lost wiring Stripe after a weekend ship.' },
    { stat: '60%', label: 'Indie founders never re-engage payment work after launch.' },
    { stat: '4', label: 'Surfaces to babysit: webhooks, dunning, tax, refunds.' },
    { stat: '$0', label: 'Revenue while billing is half-built.' },
]

export function ProblemSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Problem
                </p>
                <h2 className="font-headline text-7xl font-semibold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    Ship in a weekend.
                    <br />
                    <span className="text-white/40">Wire Stripe for two weeks.</span>
                </h2>

                <div className="grid grid-cols-4 gap-10 max-w-6xl">
                    {COSTS.map((c, i) => (
                        <div key={c.stat}>
                            <p className="text-emerald-400/60 text-base font-mono mb-3">
                                0{i + 1}
                            </p>
                            <p className="text-4xl font-bold text-white tabular-nums tracking-tight mb-2">
                                {c.stat}
                            </p>
                            <p className="text-base text-white/60 leading-snug">
                                {c.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

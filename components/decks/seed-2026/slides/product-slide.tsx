const PRIMITIVES = [
    { feature: 'Private investor portal', closes: 'leakage' },
    { feature: 'Programmatic variants + AI', closes: 'sameness' },
    { feature: 'Threaded comments', closes: 'feedback' },
    { feature: 'Live data from your sources', closes: 'ops drag' },
    { feature: 'Full npm + reuse from your app', closes: 'foundation' },
]

export function ProductSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/4 to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Product
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-12">
                    Five primitives.
                    <br />
                    <span className="text-white/40">One per cost.</span>
                </h2>

                <div className="flex flex-col gap-3 max-w-5xl">
                    {PRIMITIVES.map((p) => (
                        <div
                            key={p.feature}
                            className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4"
                        >
                            <span className="text-2xl font-semibold text-white">
                                {p.feature}
                            </span>
                            <span className="text-base font-mono text-blue-400/70 uppercase tracking-[0.18em]">
                                → {p.closes}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

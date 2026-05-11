const ROWS = [
    { who: '50k funded rounds / yr', math: '× $1,200', total: '$60M' },
    { who: '200k pre-raise founders', math: '× $240', total: '$48M' },
    { who: '30k IR + agency teams', math: '× $5,000', total: '$150M' },
]

export function MarketSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Market
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    Bottom-up.
                    <br />
                    <span className="text-white/40">No analyst reports.</span>
                </h2>

                <div className="space-y-4 max-w-4xl font-mono">
                    {ROWS.map((r) => (
                        <div
                            key={r.who}
                            className="grid grid-cols-[1fr_auto_auto] gap-12 items-baseline"
                        >
                            <span className="text-2xl text-white/80">{r.who}</span>
                            <span className="text-2xl text-white/45 tabular-nums">
                                {r.math}
                            </span>
                            <span className="text-2xl text-white tabular-nums">
                                = {r.total}
                            </span>
                        </div>
                    ))}
                    <div className="grid grid-cols-[1fr_auto_auto] gap-12 items-baseline border-t border-white/15 pt-4">
                        <span className="text-blue-300/80 uppercase tracking-[0.2em] text-base">
                            SOM
                        </span>
                        <span />
                        <span className="text-blue-300 text-4xl font-bold tabular-nums">
                            ≈ $258M
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

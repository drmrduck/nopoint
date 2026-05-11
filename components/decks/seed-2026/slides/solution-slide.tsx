const VERBS = [
    { cost: 'leakage', verb: 'Gate it.' },
    { cost: 'sameness', verb: 'Personalise it.' },
    { cost: 'feedback', verb: 'Capture it.' },
    { cost: 'ops drag', verb: 'Pipe it.' },
]

export function SolutionSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/6 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Solution
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    Slides as code.
                    <br />
                    <span className="text-white/40">Investor portal in a box.</span>
                </h2>

                <div className="grid grid-cols-4 gap-10 max-w-6xl">
                    {VERBS.map((r) => (
                        <div key={r.verb}>
                            <p className="text-blue-400/60 text-base font-mono mb-3">
                                → {r.cost}
                            </p>
                            <p className="text-3xl font-bold text-white tracking-tight">
                                {r.verb}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

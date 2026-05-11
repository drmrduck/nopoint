const COSTS = ['Leakage', 'Sameness', 'Lost feedback', 'Ops drag']

export function ProblemSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Problem
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    PowerPoint takes the power
                    <br />
                    <span className="text-white/40">out of the deck.</span>
                </h2>

                <div className="grid grid-cols-4 gap-10 max-w-6xl">
                    {COSTS.map((c, i) => (
                        <div key={c}>
                            <p className="text-blue-400/60 text-base font-mono mb-3">
                                0{i + 1}
                            </p>
                            <p className="text-3xl font-bold text-white tracking-tight">
                                {c}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const VERBS = [
    { closes: 'install', verb: 'npm i hummingbird' },
    { closes: 'webhooks', verb: 'We host the endpoint.' },
    { closes: 'portal', verb: 'Customer portal included.' },
    { closes: 'shipping', verb: 'One CLI command.' },
]

export function SolutionSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/6 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Solution
                </p>
                <h2 className="font-headline text-7xl font-semibold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    One CLI command.
                    <br />
                    <span className="text-white/40">Billing in 60 seconds.</span>
                </h2>

                <div className="grid grid-cols-4 gap-10 max-w-6xl">
                    {VERBS.map((r) => (
                        <div key={r.verb}>
                            <p className="text-emerald-400/60 text-base font-mono mb-3">
                                → {r.closes}
                            </p>
                            <p className="text-2xl font-bold text-white tracking-tight leading-snug">
                                {r.verb}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

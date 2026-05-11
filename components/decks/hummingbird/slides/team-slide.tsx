const FOUNDERS = [
    {
        initial: 'J',
        name: 'Jamie Reyes',
        role: 'Co-founder · CEO',
        story: 'Ex-Stripe. Worked on Connect: knows every webhook race condition the docs do not warn you about.',
    },
    {
        initial: 'S',
        name: 'Sam Okafor',
        role: 'Co-founder · CTO',
        story: 'Ex-Stripe. Worked on Tax: knows every jurisdiction edge case before it becomes a refund queue.',
    },
]

export function TeamSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Team
                </p>
                <h2 className="font-headline text-6xl font-semibold text-white tracking-tight leading-tight max-w-5xl mb-12">
                    Two ex-Stripe engineers.
                    <br />
                    <span className="text-white/40">Connect &amp; Tax, specifically.</span>
                </h2>

                <div className="grid grid-cols-2 gap-12 max-w-5xl">
                    {FOUNDERS.map((f) => (
                        <div key={f.name} className="flex items-start gap-5">
                            <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-200 text-3xl font-semibold shrink-0">
                                {f.initial}
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-white mb-1">{f.name}</p>
                                <p className="text-base text-emerald-300/70 mb-3">{f.role}</p>
                                <p className="text-base text-white/60 leading-relaxed">
                                    {f.story}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

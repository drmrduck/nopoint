const TIERS = [
    { name: 'OSS', price: '$0', who: 'Self-host. BYO keys.' },
    { name: 'Hosted', price: '$19', sub: '/ mo + usage', who: 'Portal, AI, audit log.' },
    { name: 'Fund', price: 'Custom', who: 'Volume, SSO, white-label.' },
]

export function BusinessModelSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Business Model
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    OSS to adopt.
                    <br />
                    <span className="text-white/40">Hosted + AI to pay.</span>
                </h2>

                <div className="grid grid-cols-3 gap-12 max-w-5xl">
                    {TIERS.map((t) => (
                        <div key={t.name}>
                            <p className="text-sm uppercase tracking-[0.22em] text-white/40 mb-3">
                                {t.name}
                            </p>
                            <div className="flex items-baseline gap-2 mb-3">
                                <p className="text-5xl font-bold text-white">
                                    {t.price}
                                </p>
                                {t.sub && (
                                    <p className="text-base text-white/45">
                                        {t.sub}
                                    </p>
                                )}
                            </div>
                            <p className="text-lg text-white/60">{t.who}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

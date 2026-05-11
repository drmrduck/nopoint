const TRUTHS = [
    { number: '01', truth: 'A deck is read 6× more often than it is presented.' },
    { number: '02', truth: 'The founder is in the room for 1 of those 6 reads.' },
    { number: '03', truth: 'Static formats give founders zero leverage in the other 5.' },
]

export function ProblemThreeTruthsVariant() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/3 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-20 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-3">
                    The Problem — Three Truths
                </p>
                <h2 className="font-headline text-4xl font-bold text-white mb-12 max-w-4xl">
                    The deck does most of its work without you in the room.
                </h2>

                <div className="space-y-6 max-w-3xl">
                    {TRUTHS.map((t) => (
                        <div key={t.number} className="flex items-baseline gap-6">
                            <span className="text-5xl font-bold text-blue-500/50 tabular-nums w-16">
                                {t.number}
                            </span>
                            <p className="text-2xl text-white/80 font-semibold leading-tight">
                                {t.truth}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-lg text-white/35 mt-12 max-w-2xl leading-relaxed">
                    Static decks treat the in-person pitch as the main event. It almost never is.
                </p>
            </div>
        </div>
    )
}

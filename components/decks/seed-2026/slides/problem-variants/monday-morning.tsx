export function ProblemMondayMorningVariant() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/3 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-20 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-3">
                    The Problem — Monday Morning
                </p>
                <h2 className="font-headline text-4xl font-bold text-white mb-10 max-w-4xl">
                    It is 8:47am. Your deck is in 14 inboxes.
                    You don&apos;t know which version, where, or who&apos;s seen it.
                </h2>

                <div className="grid grid-cols-1 gap-4 max-w-3xl">
                    {[
                        '6:12am — Forwarded by an associate to "the team" with no context.',
                        '7:38am — A partner opens slide 3 on their phone, swipes away after 11s.',
                        '8:04am — Your old co-founder pings: "is this the latest?"',
                        '8:47am — You ship a corrected v17 to one fund. The other 13 still have v15.',
                    ].map((line) => (
                        <p
                            key={line}
                            className="text-base text-white/60 font-mono pl-5 border-l-2 border-blue-500/30"
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <p className="text-lg text-white/35 mt-10 max-w-2xl leading-relaxed">
                    The artifact you spent two weeks on lost all leverage the moment it left your laptop.
                </p>
            </div>
        </div>
    )
}

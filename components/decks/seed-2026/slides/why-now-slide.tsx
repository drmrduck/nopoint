const SHIFTS = [
    { year: '2022', title: 'Component primitives won.' },
    { year: '2024', title: 'Coding agents shipped real code.' },
    { year: '2026', title: 'Agents read and operate artifacts.' },
]

export function WhyNowSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Why Now
                </p>
                <h2 className="font-headline text-7xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-16">
                    Three shifts
                    <br />
                    <span className="text-white/40">opened the door.</span>
                </h2>

                <div className="grid grid-cols-3 gap-12 max-w-6xl">
                    {SHIFTS.map((s) => (
                        <div key={s.year}>
                            <p className="text-blue-400/60 text-lg font-mono mb-4">
                                {s.year}
                            </p>
                            <p className="text-3xl font-bold text-white tracking-tight leading-tight">
                                {s.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

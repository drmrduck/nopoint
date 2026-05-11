// Y-axis precision matters: the wedge is *who writes the code*.
// Replit Slides emits React but you author via prompt — the code is a build
// artifact, not the source. So Replit lives bottom-right with Gamma, not in
// our empty quadrant.

const QUADRANTS = [
    {
        names: '— empty —',
        sub: 'Replit Slides compiles to React, but you author via prompt. The code is a build artifact, not your source.',
        empty: true,
    },
    { names: 'NoPoint', you: true },
    { names: 'PowerPoint, Google Slides, Keynote, Copilot, Plus AI' },
    { names: 'Gamma, Beautiful.ai, Tome, Pitch, Canva, Replit Slides' },
]

export function LandscapeSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Why We Win
                </p>
                <h2 className="font-headline text-6xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-10">
                    Code-first founders own
                    <br />
                    <span className="text-white/40">an empty quadrant.</span>
                </h2>

                <div className="grid grid-cols-[auto_1fr] gap-x-5 max-w-5xl">
                    <div className="flex flex-col justify-between text-sm uppercase tracking-[0.22em] text-white/55 font-mono py-4">
                        <span>you write</span>
                        <span>generated</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {QUADRANTS.map((q, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl border p-6 min-h-[8rem] flex flex-col justify-center gap-2 ${
                                    q.you
                                        ? 'border-blue-500/45 bg-blue-500/10'
                                        : q.empty
                                          ? 'border-white/8 bg-white/[0.02] border-dashed'
                                          : 'border-white/10 bg-white/[0.03]'
                                }`}
                            >
                                <p
                                    className={`tracking-tight leading-tight ${
                                        q.you
                                            ? 'text-2xl font-semibold text-white'
                                            : q.empty
                                              ? 'text-base font-mono uppercase tracking-[0.22em] text-white/35'
                                              : 'text-2xl font-semibold text-white/85'
                                    }`}
                                >
                                    {q.names}
                                </p>
                                {q.sub && (
                                    <p className="text-base text-white/45 leading-snug">
                                        {q.sub}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div />
                    <div className="flex justify-between text-sm uppercase tracking-[0.22em] text-white/55 font-mono mt-3">
                        <span>stays in editor</span>
                        <span>leaves editor</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

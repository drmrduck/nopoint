const FRICTIONS = [
    '11:14pm — Copy this month\'s MRR from Stripe → paste into slide 7.',
    '11:23pm — Screenshot the Mixpanel cohort chart. Crop. Re-upload.',
    '11:41pm — Pull the funnel from BigQuery → Sheet → screenshot → slide 9.',
    '12:08am — Export PDF. The numbers start going stale at 12:09am.',
]

export function ProblemStaleNumbersVariant() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-20 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-3">
                    The Problem: Copy. Paste. Repeat.
                </p>
                <h2 className="font-headline text-4xl font-semibold text-white mb-10 max-w-4xl">
                    Every number on slide 7 is a copy-paste from last Tuesday.
                </h2>

                <div className="grid grid-cols-1 gap-4 max-w-3xl">
                    {FRICTIONS.map((line) => (
                        <p
                            key={line}
                            className="text-base text-white/60 font-mono pl-5 border-l-2 border-amber-500/30"
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <p className="text-lg text-white/40 mt-10 max-w-3xl leading-relaxed">
                    Your live data lives one{' '}
                    <span className="font-mono text-white/70">import</span> away:
                    Stripe, Postgres, Mixpanel, any of the 2M packages on npm.
                    <span className="text-white/30"> PowerPoint can&apos;t reach any of it.</span>
                </p>
            </div>
        </div>
    )
}

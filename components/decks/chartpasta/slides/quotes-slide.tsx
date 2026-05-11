import { Eyebrow, SERGIO_QUOTES, Shell } from './shared'

export function QuotesSlide() {
    return (
        <Shell accent="from-red-700/18 via-amber-100/6 to-emerald-700/18">
            <div className="w-full">
                <Eyebrow>Voice of Sergio</Eyebrow>
                <h2 className="text-6xl font-black tracking-[-0.05em] text-amber-50 mb-12">
                    Every chart tells a story.
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {SERGIO_QUOTES.slice(0, 6).map((quote, index) => (
                        <div
                            key={quote}
                            className={[
                                'rounded-[26px] border p-6',
                                index % 3 === 0
                                    ? 'border-red-500/35 bg-red-500/10'
                                    : index % 3 === 1
                                      ? 'border-amber-100/15 bg-white/6'
                                      : 'border-emerald-500/30 bg-emerald-500/10',
                            ].join(' ')}
                        >
                            <p className="text-xl font-semibold leading-relaxed text-white/90">
                                {quote}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    )
}

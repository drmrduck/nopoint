import { ActionLink, Eyebrow, SERGIO_QUOTES, Shell } from './shared'

export function TitleSlide() {
    return (
        <Shell accent="from-red-700/28 via-amber-100/6 to-emerald-600/24">
            <div className="grid w-full gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                <div>
                    <Eyebrow>Gag Example Deck</Eyebrow>
                    <h1 className="text-7xl font-black tracking-[-0.05em] text-amber-50 xl:text-8xl">
                        Chartpasta
                    </h1>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-white/85 xl:text-4xl">
                        Pasta pulses on al dente-pilot.
                    </p>
                    <p className="mt-6 text-base uppercase tracking-[0.3em] text-amber-200/70">
                        A{' '}
                        <a
                            href="https://chartcastr.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-100 underline decoration-amber-200/40 underline-offset-4 hover:text-amber-50"
                        >
                            chartcastr.com
                        </a>{' '}
                        joint
                    </p>

                    <div className="mt-10">
                        <ActionLink>Send your first pasta pulse</ActionLink>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-black/25 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
                    <p className="text-base font-semibold text-amber-50">
                        Sergio in la kitchen
                    </p>

                    <div className="mt-5 space-y-3">
                        {SERGIO_QUOTES.slice(0, 2).map((quote) => (
                            <div
                                key={quote}
                                className="rounded-2xl border border-white/8 bg-white/5 p-5"
                            >
                                <p className="text-lg leading-relaxed text-white/85">
                                    {quote}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Shell>
    )
}

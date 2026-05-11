import { ChartcastrSource } from '@/components/decks/chartcastr-source'

const STATS = [
    { stat: '1', label: 'Deck live' },
    { stat: '0', label: 'Customers' },
    { stat: '∞', label: 'Iteration' },
]

export function TractionSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Traction
                </p>
                <h2 className="font-headline text-6xl font-bold text-white tracking-tight leading-tight mb-10">
                    Day 1.
                    <br />
                    <span className="text-white/40">Real traffic, live.</span>
                </h2>

                <div className="grid grid-cols-[1.55fr_1fr] gap-10 items-center max-w-6xl">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                        <ChartcastrSource
                            sourceId="b670aa09-e025-4ca6-a2f5-8fe57786f3ab"
                            className="aspect-video w-full"
                            badgeLabel="Live · GSC"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {STATS.map((m) => (
                            <div key={m.label} className="flex items-baseline gap-5">
                                <p className="text-6xl font-bold text-white tabular-nums leading-none w-20">
                                    {m.stat}
                                </p>
                                <p className="text-xl text-white/70">{m.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

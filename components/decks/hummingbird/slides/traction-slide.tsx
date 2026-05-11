import { fetchStripeMrr } from '@/lib/hummingbird/stripe-mrr'

const SECONDARY_STATS = [
    { stat: '4,200', label: 'Weekly active devs' },
    { stat: '14%', label: 'MoM growth · 4 months' },
    { stat: '60s', label: 'Median time-to-first-charge' },
]

function formatMrr(mrrCents: number | null): { value: string; subtitle: string } {
    if (mrrCents === null) {
        return { value: '$48K', subtitle: 'MRR · static fallback' }
    }
    const dollars = Math.round(mrrCents / 100)
    if (dollars >= 1000) {
        const k = (dollars / 1000).toFixed(dollars >= 10_000 ? 0 : 1)
        return { value: `$${k}K`, subtitle: 'MRR · live from Stripe' }
    }
    return { value: `$${dollars.toLocaleString()}`, subtitle: 'MRR · live from Stripe' }
}

export async function TractionSlide() {
    const mrrCents = await fetchStripeMrr()
    const mrr = formatMrr(mrrCents)
    const isLive = mrrCents !== null

    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Traction
                </p>
                <h2 className="font-headline text-6xl font-semibold text-white tracking-tight leading-tight mb-12">
                    Real revenue.
                    <br />
                    <span className="text-white/40">Compounding weekly.</span>
                </h2>

                <div className="grid grid-cols-[1.2fr_1fr] gap-16 items-center max-w-6xl">
                    <div className="relative">
                        <div className="flex items-baseline gap-4 mb-3">
                            <p className="font-headline text-9xl font-bold text-white tabular-nums leading-none">
                                {mrr.value}
                            </p>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    isLive
                                        ? 'bg-emerald-500/95 text-white'
                                        : 'bg-white/10 text-white/55'
                                }`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        isLive ? 'bg-white' : 'bg-white/50'
                                    }`}
                                />
                                {isLive ? 'Live' : 'Static'}
                            </span>
                        </div>
                        <p className="text-lg text-white/50">{mrr.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {SECONDARY_STATS.map((m) => (
                            <div key={m.label} className="flex items-baseline gap-5">
                                <p className="text-5xl font-bold text-white tabular-nums leading-none w-32">
                                    {m.stat}
                                </p>
                                <p className="text-lg text-white/65">{m.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

interface Pin {
    label: string
    x: number // 0 = expensive, 1 = affordable
    y: number // 0 = no transactions, 1 = transactions
    accent?: boolean
}

const PINS: Pin[] = [
    { label: 'Couchsurfing', x: 0.95, y: 0.18 },
    { label: 'Craigslist', x: 0.55, y: 0.22 },
    { label: 'Hostels.com', x: 0.45, y: 0.78 },
    { label: 'Hotels.com', x: 0.18, y: 0.85 },
    { label: 'AirBed&Breakfast', x: 0.82, y: 0.85, accent: true },
]

export function CompetitionSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline eyebrow="Competition" title="The empty quadrant: affordable + transactional." />
            <div className="mt-12 px-20">
                <div
                    className="relative mx-auto"
                    style={{
                        width: 720,
                        height: 380,
                        border: `1px solid ${AIRBNB_PALETTE.rule}`,
                        background: '#fff',
                    }}
                >
                    {/* Axes */}
                    <div
                        className="absolute left-0 right-0 top-1/2 h-px"
                        style={{ background: AIRBNB_PALETTE.rule }}
                    />
                    <div
                        className="absolute top-0 bottom-0 left-1/2 w-px"
                        style={{ background: AIRBNB_PALETTE.rule }}
                    />

                    {/* Axis labels */}
                    <span
                        className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] font-bold"
                        style={{ color: AIRBNB_PALETTE.inkSoft }}
                    >
                        ↑ Online transactions
                    </span>
                    <span
                        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] font-bold"
                        style={{ color: AIRBNB_PALETTE.inkSoft }}
                    >
                        Offline / no transactions
                    </span>
                    <span
                        className="absolute -left-32 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.32em] font-bold"
                        style={{ color: AIRBNB_PALETTE.inkSoft }}
                    >
                        ← Expensive
                    </span>
                    <span
                        className="absolute -right-28 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.32em] font-bold"
                        style={{ color: AIRBNB_PALETTE.inkSoft }}
                    >
                        Affordable →
                    </span>

                    {/* Pins */}
                    {PINS.map((p) => (
                        <div
                            key={p.label}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${p.x * 100}%`, top: `${(1 - p.y) * 100}%` }}
                        >
                            <div
                                className="px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap"
                                style={{
                                    background: p.accent ? AIRBNB_PALETTE.rausch : '#fff',
                                    color: p.accent ? '#fff' : AIRBNB_PALETTE.ink,
                                    border: `1px solid ${
                                        p.accent ? AIRBNB_PALETTE.rausch : AIRBNB_PALETTE.rule
                                    }`,
                                    boxShadow: p.accent ? '0 6px 20px rgba(255,90,95,0.25)' : 'none',
                                }}
                            >
                                {p.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AirbnbSlide>
    )
}

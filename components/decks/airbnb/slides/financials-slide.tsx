import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const YEARS = [
    { label: 'Year 1', revenue: '$5M', detail: 'Conference cycle + word-of-mouth.' },
    { label: 'Year 2', revenue: '$50M', detail: 'Top 20 US cities + first international.' },
    { label: 'Year 3', revenue: '$200M', detail: '2% of online travel — 84M trips at $25 avg.' },
] as const

const HEIGHTS = [0.16, 0.5, 1]

export function FinancialsSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Financials"
                title="Three-year revenue projection."
            />
            <div className="mt-12 px-20">
                <div
                    className="rounded-2xl p-10 flex items-end justify-between gap-12"
                    style={{
                        background: '#fff',
                        border: `1px solid ${AIRBNB_PALETTE.rule}`,
                        height: 360,
                    }}
                >
                    {YEARS.map((y, i) => (
                        <div
                            key={y.label}
                            className="flex-1 flex flex-col items-center justify-end h-full gap-4"
                        >
                            <p
                                className="text-3xl font-bold tabular-nums"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {y.revenue}
                            </p>
                            <div
                                className="w-full rounded-t-md"
                                style={{
                                    height: `${HEIGHTS[i] * 70}%`,
                                    background:
                                        i === HEIGHTS.length - 1
                                            ? AIRBNB_PALETTE.rausch
                                            : AIRBNB_PALETTE.ink,
                                }}
                            />
                            <p
                                className="text-xs font-bold uppercase tracking-[0.24em]"
                                style={{ color: AIRBNB_PALETTE.inkSoft }}
                            >
                                {y.label}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 grid grid-cols-3 gap-12">
                    {YEARS.map((y) => (
                        <p
                            key={`${y.label}-detail`}
                            className="text-sm leading-relaxed text-center"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {y.detail}
                        </p>
                    ))}
                </div>
            </div>
        </AirbnbSlide>
    )
}

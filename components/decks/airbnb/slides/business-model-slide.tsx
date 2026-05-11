import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const ROWS = [
    { label: 'Average booking', value: '$80', sub: '2 nights at $40/night' },
    { label: 'Our take', value: '10%', sub: 'Charged on each transaction' },
    { label: 'Revenue per booking', value: '$8', sub: 'Average; varies by market' },
]

export function BusinessModelSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Business Model"
                title="We take a 10% commission on each transaction."
            />
            <div className="mt-16 px-20 grid grid-cols-3 gap-8">
                {ROWS.map((r) => (
                    <div
                        key={r.label}
                        className="rounded-2xl p-8"
                        style={{
                            background: '#fff',
                            border: `1px solid ${AIRBNB_PALETTE.rule}`,
                        }}
                    >
                        <p
                            className="text-xs uppercase tracking-[0.24em] font-bold mb-3"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {r.label}
                        </p>
                        <p
                            className="font-bold tabular-nums leading-none mb-2"
                            style={{
                                color: AIRBNB_PALETTE.rausch,
                                fontSize: 72,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            {r.value}
                        </p>
                        <p
                            className="text-sm"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {r.sub}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-12 px-20">
                <div
                    className="rounded-2xl p-8 flex items-center gap-8"
                    style={{
                        background: AIRBNB_PALETTE.rausch10,
                        border: `1px solid ${AIRBNB_PALETTE.rausch30}`,
                    }}
                >
                    <div className="flex-1">
                        <p
                            className="text-xs uppercase tracking-[0.24em] font-bold mb-2"
                            style={{ color: AIRBNB_PALETTE.rausch }}
                        >
                            At 84M bookings/year
                        </p>
                        <p
                            className="text-3xl font-bold"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            10% × $25 average × 84M trips ={' '}
                            <span style={{ color: AIRBNB_PALETTE.rausch }}>
                                $200M annual revenue
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </AirbnbSlide>
    )
}

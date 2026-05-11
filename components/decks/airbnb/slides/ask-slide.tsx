import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const USE_OF_FUNDS = [
    { label: 'Engineering', value: '4 engineers · 12 months' },
    { label: 'PR', value: '1 hire · 12 months' },
    { label: 'Marketing', value: 'Conference launches + paid acquisition' },
    { label: 'Legal & ops', value: 'Payment licensing, host insurance' },
]

export function AskSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline eyebrow="The Ask" title="Raising $500K." />
            <div className="mt-12 px-20 grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-8">
                    <div>
                        <p
                            className="font-bold tabular-nums leading-none mb-3"
                            style={{
                                color: AIRBNB_PALETTE.rausch,
                                fontSize: 144,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            $500K
                        </p>
                        <p
                            className="text-2xl font-semibold"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            Seed round · 11% equity
                        </p>
                    </div>
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: AIRBNB_PALETTE.rausch10,
                            border: `1px solid ${AIRBNB_PALETTE.rausch30}`,
                        }}
                    >
                        <p
                            className="text-xs font-bold uppercase tracking-[0.24em] mb-2"
                            style={{ color: AIRBNB_PALETTE.rausch }}
                        >
                            Runway
                        </p>
                        <p
                            className="text-xl font-semibold"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            12 months to 80,000 cumulative bookings — the foothold for a $200M business.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p
                        className="text-xs font-bold uppercase tracking-[0.24em] mb-2"
                        style={{ color: AIRBNB_PALETTE.inkSoft }}
                    >
                        Use of funds
                    </p>
                    {USE_OF_FUNDS.map((u) => (
                        <div
                            key={u.label}
                            className="flex items-center gap-5 rounded-xl px-5 py-4"
                            style={{
                                background: '#fff',
                                border: `1px solid ${AIRBNB_PALETTE.rule}`,
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ background: AIRBNB_PALETTE.rausch }}
                            />
                            <p
                                className="font-bold w-36 shrink-0"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {u.label}
                            </p>
                            <p
                                className="text-sm flex-1"
                                style={{ color: AIRBNB_PALETTE.inkSoft }}
                            >
                                {u.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AirbnbSlide>
    )
}

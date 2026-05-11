import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const TIERS = [
    {
        figure: '1.9B',
        label: 'Trips booked worldwide',
        sub: 'Total addressable global travel market.',
        weight: 0.2,
    },
    {
        figure: '532M',
        label: 'Trips booked online',
        sub: 'Trips that already pass through a transactional internet platform.',
        weight: 0.55,
    },
    {
        figure: '10.6M',
        label: 'Trips on AirBed&Breakfast',
        sub: '2% market share of online travel — our beachhead target.',
        weight: 1,
    },
]

export function MarketSizeSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Market Size"
                title="A 2% slice of online travel is a $200M business."
            />
            <div className="mt-16 px-20 space-y-6">
                {TIERS.map((t, i) => (
                    <div
                        key={t.figure}
                        className="flex items-center gap-8 rounded-xl p-6"
                        style={{
                            background: i === TIERS.length - 1 ? AIRBNB_PALETTE.rausch10 : 'transparent',
                            border: `1px solid ${
                                i === TIERS.length - 1
                                    ? AIRBNB_PALETTE.rausch30
                                    : AIRBNB_PALETTE.rule
                            }`,
                        }}
                    >
                        <div className="w-72 shrink-0">
                            <p
                                className="font-bold tabular-nums leading-none"
                                style={{
                                    color:
                                        i === TIERS.length - 1
                                            ? AIRBNB_PALETTE.rausch
                                            : AIRBNB_PALETTE.ink,
                                    fontSize: 80,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {t.figure}
                            </p>
                        </div>
                        <div className="flex-1">
                            <p
                                className="text-xl font-semibold"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {t.label}
                            </p>
                            <p
                                className="text-sm mt-1"
                                style={{ color: AIRBNB_PALETTE.inkSoft }}
                            >
                                {t.sub}
                            </p>
                        </div>
                        <div className="w-64 shrink-0">
                            <div
                                className="h-3 rounded-full overflow-hidden"
                                style={{ background: AIRBNB_PALETTE.rule }}
                            >
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${t.weight * 100}%`,
                                        background: AIRBNB_PALETTE.rausch,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AirbnbSlide>
    )
}

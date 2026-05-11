import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const COMPETITORS = ['Couchsurfing', 'Craigslist', 'Hostels.com', 'Hotels.com', 'AirBed&Breakfast'] as const
const FEATURES = [
    { name: 'Trip transactions', vals: [false, false, true, true, true] },
    { name: 'Listings', vals: [true, true, true, true, true] },
    { name: 'Trust through reviews', vals: [true, false, false, true, true] },
    { name: 'Affordability', vals: [true, true, false, false, true] },
] as const

function Mark({ on, accent }: { on: boolean; accent: boolean }) {
    if (!on) {
        return (
            <span
                className="inline-block h-2 w-6 rounded-full"
                style={{ background: AIRBNB_PALETTE.rule }}
            />
        )
    }
    return (
        <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-base font-bold"
            style={{
                background: accent ? AIRBNB_PALETTE.rausch : AIRBNB_PALETTE.ink,
                color: AIRBNB_PALETTE.paper,
            }}
        >
            ✓
        </span>
    )
}

export function CompetitiveAdvantagesSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Competitive Advantages"
                title="Only AirBed&Breakfast checks every box."
            />
            <div className="mt-12 px-20">
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `220px repeat(${COMPETITORS.length}, 1fr)`,
                    }}
                >
                    <div />
                    {COMPETITORS.map((c, i) => (
                        <div
                            key={c}
                            className="text-center px-2 py-3"
                            style={{
                                color:
                                    i === COMPETITORS.length - 1
                                        ? AIRBNB_PALETTE.rausch
                                        : AIRBNB_PALETTE.inkSoft,
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {c}
                        </div>
                    ))}

                    {FEATURES.map((f, rowIdx) => (
                        <div
                            key={f.name}
                            className="contents"
                        >
                            <div
                                className="px-3 py-5 text-base font-semibold flex items-center"
                                style={{
                                    color: AIRBNB_PALETTE.ink,
                                    borderTop: `1px solid ${AIRBNB_PALETTE.rule}`,
                                }}
                            >
                                {f.name}
                            </div>
                            {f.vals.map((on, i) => (
                                <div
                                    key={`${rowIdx}-${i}`}
                                    className="flex items-center justify-center"
                                    style={{
                                        borderTop: `1px solid ${AIRBNB_PALETTE.rule}`,
                                        background:
                                            i === COMPETITORS.length - 1
                                                ? AIRBNB_PALETTE.rausch10
                                                : 'transparent',
                                    }}
                                >
                                    <Mark on={on} accent={i === COMPETITORS.length - 1} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </AirbnbSlide>
    )
}

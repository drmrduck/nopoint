import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const TIERS: Array<{
    name: string
    price: string
    units: string
    callout: string
    highlight?: boolean
}> = [
    {
        name: 'Free',
        price: '$0',
        units: '1 account · 10 posts',
        callout: 'The on-ramp. Drives 90% of signups.',
    },
    {
        name: 'Awesome',
        price: '$10',
        units: '12 accounts · 200 posts',
        callout: 'The mass-market upgrade. 4% of users convert.',
        highlight: true,
    },
    {
        name: 'Business',
        price: '$50–250',
        units: '25–50 accounts · team workflows',
        callout: 'Power users and brands. Highest LTV.',
    },
]

export function BusinessModelSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-[1.02]"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    Freemium.
                    <br />
                    <span style={{ color: BUFFER_PALETTE.green }}>4%</span> of free users
                    upgrade.
                </h1>
            </div>

            <div className="mt-12 px-20 grid grid-cols-3 gap-8">
                {TIERS.map((t) => (
                    <div
                        key={t.name}
                        className="flex flex-col gap-3 text-center pb-2"
                        style={{
                            borderBottom: t.highlight
                                ? `4px solid ${BUFFER_PALETTE.green}`
                                : `2px solid ${BUFFER_PALETTE.rule}`,
                        }}
                    >
                        <p
                            className="text-2xl font-black uppercase tracking-[0.16em]"
                            style={{
                                color: t.highlight
                                    ? BUFFER_PALETTE.green
                                    : BUFFER_PALETTE.ink,
                            }}
                        >
                            {t.name}
                        </p>
                        <p
                            className="font-black tabular-nums leading-none"
                            style={{
                                color: BUFFER_PALETTE.ink,
                                fontSize: 80,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {t.price}
                        </p>
                        <p
                            className="text-sm font-black uppercase tracking-[0.18em]"
                            style={{ color: BUFFER_PALETTE.inkSoft }}
                        >
                            per month
                        </p>
                        <p
                            className="text-base font-black mt-2"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            {t.units}
                        </p>
                        <p
                            className="text-sm font-bold"
                            style={{ color: BUFFER_PALETTE.inkSoft }}
                        >
                            {t.callout}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10 px-20 flex items-center gap-6">
                <p
                    className="text-xs font-black uppercase tracking-[0.32em]"
                    style={{ color: BUFFER_PALETTE.green }}
                >
                    Net result
                </p>
                <p
                    className="text-xl font-black"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    $9 average revenue per paying user · $150K annual revenue today.
                </p>
            </div>
        </BufferSlide>
    )
}

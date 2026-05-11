import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const VALIDATIONS = [
    {
        figure: '630,000',
        title: 'listings on Couchsurfing.com',
        sub: 'Cumulative listings as of January 2008.',
    },
    {
        figure: '17,000',
        title: 'temp-housing listings on Craigslist',
        sub: 'San Francisco + New York City — single 1-week sample.',
    },
]

export function MarketValidationSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Market Validation"
                title="People already book each other's couches and spare rooms."
            />
            <div className="mt-20 px-20 grid grid-cols-2 gap-12">
                {VALIDATIONS.map((v) => (
                    <div key={v.figure} className="flex flex-col">
                        <p
                            className="font-bold tabular-nums leading-none mb-6"
                            style={{
                                color: AIRBNB_PALETTE.ink,
                                fontSize: 116,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {v.figure}
                        </p>
                        <p
                            className="text-2xl font-semibold mb-2"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            {v.title}
                        </p>
                        <p
                            className="text-base"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {v.sub}
                        </p>
                    </div>
                ))}
            </div>
            <p
                className="absolute bottom-10 left-20 text-xs"
                style={{ color: AIRBNB_PALETTE.inkSoft }}
            >
                The market is renting beds informally — they just don&apos;t have a transactional layer.
            </p>
        </AirbnbSlide>
    )
}

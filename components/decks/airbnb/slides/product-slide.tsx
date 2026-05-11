import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const STEPS = [
    {
        n: '1',
        label: 'Search by city',
        body: 'Type a city, dates, and how many guests. Browse listings on a familiar map.',
    },
    {
        n: '2',
        label: 'View listings',
        body: 'Photos, price per night, host bio, reviews. Everything to make a decision.',
    },
    {
        n: '3',
        label: 'Book it',
        body: 'Pay through the platform. Hosts and guests are matched in seconds.',
    },
]

export function ProductSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline eyebrow="Product" title="Three steps. Live since August 2008." />
            <div className="mt-16 px-20 grid grid-cols-3 gap-10">
                {STEPS.map((s) => (
                    <div
                        key={s.n}
                        className="rounded-2xl p-8 flex flex-col gap-5"
                        style={{
                            background: '#fff',
                            border: `1px solid ${AIRBNB_PALETTE.rule}`,
                        }}
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold"
                            style={{
                                background: AIRBNB_PALETTE.rausch,
                                color: AIRBNB_PALETTE.paper,
                            }}
                        >
                            {s.n}
                        </div>
                        <p
                            className="text-2xl font-bold"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            {s.label}
                        </p>
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {s.body}
                        </p>
                    </div>
                ))}
            </div>
            <div
                className="absolute bottom-10 left-20 right-20 flex items-center justify-between text-xs"
                style={{ color: AIRBNB_PALETTE.inkSoft }}
            >
                <span>Live demo: airbedandbreakfast.com</span>
                <span>iPhone-friendly · payment processing built-in</span>
            </div>
        </AirbnbSlide>
    )
}

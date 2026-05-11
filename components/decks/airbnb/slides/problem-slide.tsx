import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const POINTS = [
    {
        n: '01',
        body: 'Price is an important concern for customers booking travel online.',
    },
    {
        n: '02',
        body: 'Hotels leave you disconnected from the city and its culture.',
    },
    {
        n: '03',
        body: 'No easy way exists to book a room with a local — or become a host.',
    },
]

export function ProblemSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline eyebrow="Problem" title="Travel today is expensive, sterile, and one-sided." />
            <div className="mt-16 grid grid-cols-3 gap-12 px-20">
                {POINTS.map((p) => (
                    <div key={p.n} className="flex flex-col gap-5">
                        <span
                            className="text-2xl font-bold tabular-nums"
                            style={{ color: AIRBNB_PALETTE.rausch }}
                        >
                            {p.n}
                        </span>
                        <p
                            className="text-2xl leading-snug font-medium"
                            style={{ color: AIRBNB_PALETTE.ink }}
                        >
                            {p.body}
                        </p>
                    </div>
                ))}
            </div>
        </AirbnbSlide>
    )
}

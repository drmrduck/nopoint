import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const STATS = [
    {
        figure: '$7.4B',
        label: 'Twitter + Facebook ad revenue (2013)',
        sub: 'Brands are spending heavily on social. We make their organic side work better.',
    },
    {
        figure: '1.2B',
        label: 'Active social media users',
        sub: 'Across Facebook, Twitter, LinkedIn, Google+ combined.',
    },
    {
        figure: '60%',
        label: 'of social media managers use 3+ tools',
        sub: 'Fragmentation is the wedge. We unify scheduling.',
    },
]

export function MarketSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 110 }}
                >
                    Market
                </h1>
            </div>

            <div className="mt-14 px-20 space-y-8">
                {STATS.map((s) => (
                    <div
                        key={s.figure}
                        className="flex items-center gap-12"
                    >
                        <p
                            className="font-black tabular-nums leading-none w-72 shrink-0"
                            style={{
                                color: BUFFER_PALETTE.ink,
                                fontSize: 96,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {s.figure}
                        </p>
                        <div className="flex-1">
                            <p
                                className="text-2xl font-black"
                                style={{ color: BUFFER_PALETTE.ink }}
                            >
                                {s.label}
                            </p>
                            <p
                                className="text-lg mt-1 font-bold"
                                style={{ color: BUFFER_PALETTE.green }}
                            >
                                {s.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </BufferSlide>
    )
}

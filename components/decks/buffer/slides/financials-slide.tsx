import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const YEARS = [
    {
        label: 'Year 1',
        revenue: '$400K',
        detail: "Today's run rate × growth. Already profitable.",
        weight: 0.08,
    },
    {
        label: 'Year 2',
        revenue: '$1.5M',
        detail: 'Team plan + Pinterest unlock new segment.',
        weight: 0.3,
    },
    {
        label: 'Year 3',
        revenue: '$5M',
        detail: 'Conservative — assumes only 2% conversion stays flat.',
        weight: 1,
    },
] as const

export function FinancialsSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    $400K → $1.5M →{' '}
                    <span style={{ color: BUFFER_PALETTE.green }}>$5M</span>
                </h1>
            </div>

            <div className="mt-12 px-20">
                <div
                    className="flex items-end justify-between gap-12"
                    style={{ height: 340 }}
                >
                    {YEARS.map((y, i) => (
                        <div
                            key={y.label}
                            className="flex-1 flex flex-col items-center justify-end h-full gap-4"
                        >
                            <p
                                className="text-4xl font-black tabular-nums"
                                style={{ color: BUFFER_PALETTE.ink }}
                            >
                                {y.revenue}
                            </p>
                            <div
                                className="w-full"
                                style={{
                                    height: `${y.weight * 70}%`,
                                    background:
                                        i === YEARS.length - 1
                                            ? BUFFER_PALETTE.green
                                            : BUFFER_PALETTE.ink,
                                }}
                            />
                            <p
                                className="text-sm font-black uppercase tracking-[0.24em]"
                                style={{ color: BUFFER_PALETTE.ink }}
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
                            className="text-sm font-bold leading-snug text-center"
                            style={{ color: BUFFER_PALETTE.inkSoft }}
                        >
                            {y.detail}
                        </p>
                    ))}
                </div>
            </div>
        </BufferSlide>
    )
}

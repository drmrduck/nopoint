import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const METRICS = [
    { figure: '800K', label: 'Registered users', sub: '10% MoM growth.' },
    {
        figure: '$150K',
        label: 'Annual revenue (run rate)',
        sub: 'Profitable since Q1 2012.',
    },
    {
        figure: '30%',
        label: 'MoM revenue growth',
        sub: 'Over the past six months.',
    },
]

const SPARK_POINTS = [10, 14, 19, 23, 28, 36, 47, 58, 72, 86, 100]

export function TractionSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 110 }}
                >
                    Traction
                </h1>
            </div>

            <div className="mt-12 px-20 grid grid-cols-3 gap-8">
                {METRICS.map((m) => (
                    <div key={m.label} className="text-center">
                        <p
                            className="font-black tabular-nums leading-none mb-3"
                            style={{
                                color: BUFFER_PALETTE.ink,
                                fontSize: 84,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {m.figure}
                        </p>
                        <p
                            className="text-xl font-bold"
                            style={{ color: BUFFER_PALETTE.green }}
                        >
                            {m.label}
                        </p>
                        <p
                            className="text-base mt-1 font-bold"
                            style={{ color: BUFFER_PALETTE.inkSoft }}
                        >
                            {m.sub}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 px-20">
                <div
                    className="flex items-end justify-between mb-3"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    <p className="text-xs font-black uppercase tracking-[0.24em]">
                        Monthly revenue · last 11 months
                    </p>
                    <p
                        className="text-xs font-black"
                        style={{ color: BUFFER_PALETTE.green }}
                    >
                        Up and to the right.
                    </p>
                </div>
                <svg
                    viewBox="0 0 1000 160"
                    className="w-full h-32"
                    preserveAspectRatio="none"
                >
                    <polyline
                        fill="none"
                        stroke={BUFFER_PALETTE.green}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={SPARK_POINTS.map(
                            (p, i) =>
                                `${(i / (SPARK_POINTS.length - 1)) * 1000},${
                                    160 - (p / 100) * 140
                                }`,
                        ).join(' ')}
                    />
                    <polygon
                        fill={BUFFER_PALETTE.greenSoft}
                        stroke="none"
                        points={[
                            ...SPARK_POINTS.map(
                                (p, i) =>
                                    `${(i / (SPARK_POINTS.length - 1)) * 1000},${
                                        160 - (p / 100) * 140
                                    }`,
                            ),
                            '1000,160',
                            '0,160',
                        ].join(' ')}
                    />
                </svg>
            </div>
        </BufferSlide>
    )
}

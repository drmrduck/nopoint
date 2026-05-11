import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const FOUNDERS = [
    {
        name: 'Joel Gascoigne',
        blurb: 'Co-Founder, took the idea to revenue in 7 weeks, Masters in CS',
    },
    {
        name: 'Leo Widrich',
        blurb: 'Co-Founder, marketeer, took Buffer from 200 to 55,000 users',
    },
]

const ADVISORS = [
    {
        name: 'Guy Kawasaki',
        blurb: 'Former Chief Evangelist of Apple. Co-Founder of Alltop. Author of ten books',
    },
    {
        name: 'Hiten Shah',
        blurb: 'CEO / Co-Founder of KISSmetrics. Previously started CrazyEgg & ACS',
    },
    {
        name: 'Andrew Chen',
        blurb: 'Growth advisor, prolific essayist on viral loops and retention',
    },
]

const SILHOUETTE_FILL = 'rgba(0, 0, 0, 0.05)'

function GhostFigure({ x, scale = 1 }: { x: number; scale?: number }) {
    const head = 90 * scale
    const shoulderRx = 200 * scale
    const shoulderRy = 240 * scale
    return (
        <g transform={`translate(${x}, 0)`}>
            <circle cx={0} cy={170 * scale} r={head} fill={SILHOUETTE_FILL} />
            <ellipse
                cx={0}
                cy={500 * scale}
                rx={shoulderRx}
                ry={shoulderRy}
                fill={SILHOUETTE_FILL}
            />
        </g>
    )
}

export function TeamSlide() {
    return (
        <BufferSlide showWordmark={false}>
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1280 720"
                preserveAspectRatio="none"
                aria-hidden
            >
                <GhostFigure x={300} scale={0.95} />
                <GhostFigure x={640} scale={0.95} />
                <GhostFigure x={980} scale={0.95} />
            </svg>

            <div className="relative h-full w-full px-20 pt-10 pb-10">
                <h1
                    className="text-center font-black tracking-tight"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    Team
                </h1>

                <div className="mt-8 space-y-5">
                    {FOUNDERS.map((f) => (
                        <div key={f.name}>
                            <p
                                className="text-5xl font-black tracking-tight leading-none"
                                style={{ color: BUFFER_PALETTE.ink }}
                            >
                                {f.name}
                            </p>
                            <p
                                className="mt-2 text-2xl font-black"
                                style={{ color: BUFFER_PALETTE.green }}
                            >
                                {f.blurb}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-2 gap-12">
                    <div>
                        <h2
                            className="text-center text-5xl font-black tracking-tight"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            Advisors
                        </h2>
                        <div className="mt-6 space-y-4">
                            {ADVISORS.map((a) => (
                                <div key={a.name}>
                                    <p
                                        className="text-xl font-black leading-tight"
                                        style={{ color: BUFFER_PALETTE.ink }}
                                    >
                                        {a.name}
                                    </p>
                                    <p
                                        className="text-sm font-bold leading-snug mt-0.5"
                                        style={{ color: BUFFER_PALETTE.inkSoft }}
                                    >
                                        {a.blurb}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2
                            className="text-center text-5xl font-black tracking-tight"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            Previous Investors
                        </h2>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <LogoTile>
                                <span
                                    className="text-2xl font-black tracking-tight"
                                    style={{ color: '#D6322F' }}
                                >
                                    Angel
                                </span>
                                <span
                                    className="text-2xl font-black tracking-tight"
                                    style={{ color: BUFFER_PALETTE.ink }}
                                >
                                    Pad
                                </span>
                            </LogoTile>
                            <LogoTile>
                                <span
                                    className="flex h-7 w-7 items-center justify-center rounded-full"
                                    style={{
                                        border: `2.5px solid ${BUFFER_PALETTE.green}`,
                                    }}
                                >
                                    <span
                                        className="block h-3 w-[3px] rounded-sm"
                                        style={{ background: BUFFER_PALETTE.green }}
                                    />
                                </span>
                                <span
                                    className="text-xl font-black tracking-tight"
                                    style={{ color: BUFFER_PALETTE.inkSoft }}
                                >
                                    INSPIRATION
                                </span>
                            </LogoTile>
                            <LogoTile>
                                <svg width="28" height="22" viewBox="0 0 28 22">
                                    <polygon
                                        points="2,20 11,4 16,12 19,8 26,20"
                                        fill={BUFFER_PALETTE.ink}
                                    />
                                </svg>
                                <span
                                    className="text-xl font-black tracking-tight"
                                    style={{ color: BUFFER_PALETTE.ink }}
                                >
                                    Monashees
                                </span>
                            </LogoTile>
                            <LogoTile>
                                <span
                                    className="flex h-9 w-9 items-center justify-center"
                                    style={{ background: '#C8222B' }}
                                >
                                    <span className="text-xl font-black text-white tracking-tight leading-none">
                                        IVY
                                    </span>
                                </span>
                            </LogoTile>
                        </div>
                    </div>
                </div>
            </div>
        </BufferSlide>
    )
}

function LogoTile({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="flex items-center justify-center gap-2 rounded-sm"
            style={{
                background: BUFFER_PALETTE.paperWhite,
                border: '1px solid rgba(0,0,0,0.08)',
                height: 64,
            }}
        >
            {children}
        </div>
    )
}

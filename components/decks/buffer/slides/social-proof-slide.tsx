import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const PRESS = [
    'TechCrunch',
    'The Next Web',
    'Mashable',
    'Lifehacker',
    'Forbes',
    'Fast Company',
    'Inc.',
    'Wired',
]

const INVESTORS = [
    { name: '500 Startups', role: 'Pre-seed (2011)' },
    { name: 'Hiten Shah', role: 'Angel · KISSmetrics, Crazy Egg' },
    { name: 'Andrew Chen', role: 'Angel · growth investor' },
    { name: 'Eric Ries', role: 'Angel · Lean Startup' },
]

export function SocialProofSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    Press & Investors
                </h1>
            </div>

            <div className="mt-12 px-20 grid grid-cols-2 gap-12">
                <div>
                    <p
                        className="text-xl font-black uppercase tracking-[0.18em] mb-6"
                        style={{ color: BUFFER_PALETTE.ink }}
                    >
                        Investors & advisors
                    </p>
                    <div className="space-y-4">
                        {INVESTORS.map((inv) => (
                            <div key={inv.name}>
                                <p
                                    className="text-2xl font-black"
                                    style={{ color: BUFFER_PALETTE.ink }}
                                >
                                    {inv.name}
                                </p>
                                <p
                                    className="text-base font-bold"
                                    style={{ color: BUFFER_PALETTE.green }}
                                >
                                    {inv.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p
                        className="text-xl font-black uppercase tracking-[0.18em] mb-6"
                        style={{ color: BUFFER_PALETTE.ink }}
                    >
                        Featured in
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {PRESS.map((p) => (
                            <div
                                key={p}
                                className="flex items-center justify-center px-4 py-4"
                                style={{
                                    background: BUFFER_PALETTE.paperWhite,
                                    border: `1px solid ${BUFFER_PALETTE.paperEdge}`,
                                }}
                            >
                                <p
                                    className="text-lg font-black tracking-tight"
                                    style={{ color: BUFFER_PALETTE.ink }}
                                >
                                    {p}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BufferSlide>
    )
}

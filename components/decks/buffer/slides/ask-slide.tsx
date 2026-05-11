import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const USE_OF_FUNDS = [
    { label: 'Engineering', value: 'Two senior hires + native mobile' },
    { label: 'Marketing', value: 'Content amplification + paid acquisition' },
    {
        label: 'Customer success',
        value: 'Two community-managers for the larger plan tier',
    },
    {
        label: 'Product',
        value: 'Team plan, analytics, Pinterest, suggested content',
    },
]

export function AskSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    The ask
                </h1>
            </div>

            <div className="mt-10 px-20 grid grid-cols-2 gap-16">
                <div className="flex flex-col gap-8">
                    <div>
                        <p
                            className="font-black tabular-nums leading-none mb-4"
                            style={{
                                color: BUFFER_PALETTE.ink,
                                fontSize: 168,
                                letterSpacing: '-0.04em',
                            }}
                        >
                            $500K
                        </p>
                        <p
                            className="text-2xl font-black"
                            style={{ color: BUFFER_PALETTE.green }}
                        >
                            Convertible note · $4M cap
                        </p>
                    </div>
                    <p
                        className="text-xl font-bold leading-snug"
                        style={{ color: BUFFER_PALETTE.ink }}
                    >
                        We&apos;re profitable, but we&apos;re leaving growth on the table.
                        $500K buys two senior engineers and a year of channel experiments.
                    </p>
                </div>

                <div>
                    <p
                        className="text-xl font-black uppercase tracking-[0.18em] mb-6"
                        style={{ color: BUFFER_PALETTE.ink }}
                    >
                        Use of funds
                    </p>
                    <div className="flex flex-col gap-4">
                        {USE_OF_FUNDS.map((u) => (
                            <div key={u.label}>
                                <p
                                    className="text-2xl font-black flex items-baseline gap-3"
                                    style={{ color: BUFFER_PALETTE.ink }}
                                >
                                    <span aria-hidden>-</span> {u.label}
                                </p>
                                <p
                                    className="text-base font-bold pl-7"
                                    style={{ color: BUFFER_PALETTE.green }}
                                >
                                    {u.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </BufferSlide>
    )
}

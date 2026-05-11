import { BufferSlide, BUFFER_PALETTE } from './_chrome'

export function VisionSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 110 }}
                >
                    Vision
                </h1>
            </div>

            <div className="mt-14 px-20">
                <p
                    className="text-4xl font-black leading-snug"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    The{' '}
                    <span style={{ color: BUFFER_PALETTE.green }}>
                        simplest possible way
                    </span>{' '}
                    to schedule and share content across Twitter, Facebook,
                    LinkedIn, Google+ — and every social network the next decade
                    brings.
                </p>
            </div>

            <div className="mt-14 px-20 grid grid-cols-3 gap-10">
                {[
                    {
                        title: 'For individuals',
                        body: 'A buffer of great content, posted at the best times, automatically.',
                    },
                    {
                        title: 'For teams',
                        body: 'Multiple contributors, approval workflows, and shared analytics.',
                    },
                    {
                        title: 'For brands',
                        body: 'A central queue across every account, with permissions and audit trails.',
                    },
                ].map((p) => (
                    <div key={p.title}>
                        <p
                            className="text-2xl font-black mb-2"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            {p.title}
                        </p>
                        <p
                            className="text-lg font-bold leading-snug"
                            style={{ color: BUFFER_PALETTE.green }}
                        >
                            {p.body}
                        </p>
                    </div>
                ))}
            </div>
        </BufferSlide>
    )
}

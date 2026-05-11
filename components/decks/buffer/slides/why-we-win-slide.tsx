import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const REASONS = [
    {
        n: '01',
        title: 'Distribution baked in',
        body: 'Every Buffered post can include a "via Buffer" attribution. 30% of new signups are from existing users\' tweets.',
    },
    {
        n: '02',
        title: 'Best-in-class onboarding',
        body: 'Browser extension installs convert 60% better than competitor web apps. The product earns the click before the signup.',
    },
    {
        n: '03',
        title: 'Profitable while small',
        body: 'We don\'t need to win the market — we already have unit economics that work at $150K ARR.',
    },
    {
        n: '04',
        title: 'Beloved brand',
        body: 'NPS 71. Hootsuite NPS is in the high 30s. Customers actively recommend us.',
    },
]

export function WhyWeWinSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    Why we will win
                </h1>
            </div>

            <div className="mt-12 px-20 grid grid-cols-2 gap-x-12 gap-y-10">
                {REASONS.map((r) => (
                    <div key={r.n} className="flex gap-5">
                        <span
                            className="text-3xl font-black tabular-nums shrink-0"
                            style={{ color: BUFFER_PALETTE.green }}
                        >
                            {r.n}
                        </span>
                        <div>
                            <p
                                className="text-2xl font-black mb-2"
                                style={{ color: BUFFER_PALETTE.ink }}
                            >
                                {r.title}
                            </p>
                            <p
                                className="text-base font-bold leading-snug"
                                style={{ color: BUFFER_PALETTE.inkSoft }}
                            >
                                {r.body}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </BufferSlide>
    )
}

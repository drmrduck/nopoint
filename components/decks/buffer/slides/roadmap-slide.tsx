import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const EXPERIMENTS = [
    {
        title: 'Multi-account team plan',
        hypothesis: 'Brands will pay $50–250/mo for shared workflows.',
        when: 'Q4 2013',
    },
    {
        title: 'Native analytics',
        hypothesis: 'Existing users will upgrade for click data inside the dashboard.',
        when: 'Q4 2013',
    },
    {
        title: 'Pinterest support',
        hypothesis: 'Visual networks expand TAM by 30%.',
        when: 'Q1 2014',
    },
    {
        title: 'Suggested content',
        hypothesis: 'Curated recommendations reduce empty-queue churn.',
        when: 'Q1 2014',
    },
    {
        title: 'Power-scheduling API',
        hypothesis: 'Tier-3 users want to script their own posting rules.',
        when: 'Q2 2014',
    },
]

export function RoadmapSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-12">
                <h1
                    className="text-center font-black tracking-tight leading-none"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    The next five experiments
                </h1>
            </div>

            <div className="mt-12 px-20 space-y-5">
                {EXPERIMENTS.map((e) => (
                    <div
                        key={e.title}
                        className="flex items-baseline gap-6"
                        style={{
                            borderBottom: `1px solid ${BUFFER_PALETTE.rule}`,
                            paddingBottom: 14,
                        }}
                    >
                        <span
                            className="text-sm font-black uppercase tracking-[0.24em] w-24 shrink-0"
                            style={{ color: BUFFER_PALETTE.green }}
                        >
                            {e.when}
                        </span>
                        <p
                            className="text-2xl font-black w-72 shrink-0"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            {e.title}
                        </p>
                        <p
                            className="text-base font-bold flex-1"
                            style={{ color: BUFFER_PALETTE.inkSoft }}
                        >
                            {e.hypothesis}
                        </p>
                    </div>
                ))}
            </div>
        </BufferSlide>
    )
}

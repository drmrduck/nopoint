const PLANS = [
    {
        name: 'Starter',
        price: '$300/mo',
        detail: 'One company workspace, live deck hosting, and polished exports for active fundraising.',
    },
    {
        name: 'Growth',
        price: '$1.2k/mo',
        detail: 'Multiple decks, investor comments, permissions, and internal collaboration for repeat publishers.',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        detail: 'Funds, studios, and larger teams with white-labeling, security controls, and premium support.',
    },
]

const MODEL = [
    ['86%+', 'Illustrative gross margin once hosting and export costs normalize'],
    ['<2 months', 'Target payback on founder-led acquisition for early startup customers'],
    ['120%+', 'Expansion path as companies add decks, teammates, and investor workflows'],
    ['Low services', 'Implementation stays light because the deck system is the product'],
]

export function FinancialsSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center gap-10 px-20 w-full relative z-10">
                <div className="flex-1">
                    <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-3">
                        Financial Model
                    </p>
                    <h2 className="font-headline text-4xl font-bold text-white mb-3">
                        High-margin software, clear expansion path
                    </h2>
                    <p className="text-sm text-white/45 leading-relaxed mb-8 max-w-xl">
                        This example model assumes a focused SaaS motion: founder-led sales at
                        the start, then expansion through more decks, more collaborators, and
                        higher-stakes investor workflows.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className="rounded-2xl border border-white/8 bg-white/4 p-5"
                            >
                                <p className="text-xs uppercase tracking-[0.2em] text-white/35 mb-3">
                                    {plan.name}
                                </p>
                                <p className="text-2xl font-bold text-white mb-3">{plan.price}</p>
                                <p className="text-xs text-white/45 leading-relaxed">
                                    {plan.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-[25rem] rounded-[2rem] border border-blue-500/15 bg-blue-500/6 p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-400/80 mb-5">
                        Example Unit Model
                    </p>
                    <div className="space-y-4">
                        {MODEL.map(([value, detail]) => (
                            <div key={value} className="flex gap-4">
                                <div className="w-20 shrink-0 text-xl font-bold text-white">
                                    {value}
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    {detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/8">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                            Seed Goal
                        </p>
                        <p className="text-lg text-white leading-relaxed">
                            Reach repeatable demand before scaling headcount.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

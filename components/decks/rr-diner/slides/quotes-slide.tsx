import { TOWN_QUOTES, Eyebrow, NeonCard, Shell } from './shared'

export function QuotesSlide() {
    return (
        <Shell accent="from-[#49d7d2]/18 via-[#fff9ea]/78 to-[#ff5a54]/18">
            <div className="w-full">
                <Eyebrow>Town Feedback</Eyebrow>
                <h2 className="max-w-4xl text-6xl font-black tracking-[-0.05em] text-[#3b1717] mb-12">
                    Voice of the booth.
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    {TOWN_QUOTES.map((quote) => (
                        <NeonCard key={quote} className="p-7">
                            <p className="text-2xl font-semibold leading-snug text-[#3f1b1b]">
                                {quote}
                            </p>
                        </NeonCard>
                    ))}
                </div>
            </div>
        </Shell>
    )
}

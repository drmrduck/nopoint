import { Eyebrow, NeonCard, Pill, Shell } from './shared'

export function TitleSlide() {
    return (
        <Shell accent="from-[#49d7d2]/20 via-[#fff8e8]/75 to-[#ff5a54]/20">
            <div className="grid w-full gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                <div>
                    <Eyebrow>Gag Example Deck</Eyebrow>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Pill tone="red">RR Diner</Pill>
                        <Pill tone="teal">Coffee Forward</Pill>
                    </div>

                    <h1 className="text-7xl font-black tracking-[-0.06em] text-[#3b1717] xl:text-8xl leading-[0.95]">
                        RR Diner
                        <br />
                        Situation Room
                    </h1>
                    <p className="mt-6 text-3xl font-bold tracking-tight text-[#d94a45] xl:text-4xl">
                        All pie. All coffee. No point.
                    </p>
                </div>

                <NeonCard className="overflow-hidden p-3">
                    <div
                        className="h-[28rem] rounded-[24px] border border-[#7d3a35]/10 bg-[#1b1312]"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(15,11,11,0.05), rgba(15,11,11,0.28)), url('/rr-diner-exterior.webp')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </NeonCard>
            </div>
        </Shell>
    )
}

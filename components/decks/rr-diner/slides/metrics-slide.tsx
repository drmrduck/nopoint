import { RR_FACTS, Eyebrow, NeonCard, Shell } from './shared'

export function MetricsSlide() {
    return (
        <Shell accent="from-[#49d7d2]/22 via-[#fff7df]/72 to-[#ffcd57]/24">
            <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
                <div>
                    <Eyebrow>Coffee and Pie Ops</Eyebrow>
                    <h2 className="max-w-3xl text-6xl font-black tracking-[-0.05em] text-[#3b1717]">
                        The numbers
                        <br />
                        are diner-serious.
                    </h2>

                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                        {RR_FACTS.map((fact) => {
                            const Icon = fact.icon
                            return (
                                <NeonCard key={fact.label} className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d94a45]">
                                                {fact.label}
                                            </p>
                                            <p className="mt-3 text-4xl font-black tracking-tight text-[#3d1919]">
                                                {fact.value}
                                            </p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#49d7d2]/12">
                                            <Icon className="h-6 w-6 text-[#157d7a]" />
                                        </div>
                                    </div>
                                </NeonCard>
                            )
                        })}
                    </div>
                </div>

                <NeonCard className="overflow-hidden p-4">
                    <div
                        className="h-[28rem] rounded-[24px] border border-[#7d3a35]/10 bg-[#fbe0e6]"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06)), url('/rr-diner-pie.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </NeonCard>
            </div>
        </Shell>
    )
}

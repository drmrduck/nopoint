import { ClipboardList, Shield, Siren, ThermometerSun } from 'lucide-react'
import { Eyebrow, NeonCard, Pill, Shell } from './shared'

const POLICIES = [
    { icon: ClipboardList, title: 'Three officers? Open a fresh pot.' },
    { icon: Siren, title: 'Lot tension? Count vehicles, not omens.' },
    { icon: ThermometerSun, title: 'Charged room? Check the neon first.' },
    { icon: Shield, title: 'Supernatural take? Politely decline.' },
]

export function IncidentsSlide() {
    return (
        <Shell accent="from-[#ff5a54]/18 via-[#fff9ea]/74 to-[#ffcd57]/22">
            <div className="grid w-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div>
                    <Eyebrow>Incident Policy</Eyebrow>
                    <h2 className="text-6xl font-black tracking-[-0.05em] text-[#3b1717] leading-[1.02]">
                        Normal
                        <br />
                        explanations
                        <br />
                        only.
                    </h2>

                    <div className="mt-8 flex flex-wrap gap-2">
                        <Pill tone="red">No portals</Pill>
                        <Pill tone="teal">No dreams</Pill>
                        <Pill>Yes to pie</Pill>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {POLICIES.map((policy) => {
                        const Icon = policy.icon
                        return (
                            <NeonCard key={policy.title} className="p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5a54]/10">
                                    <Icon className="h-6 w-6 text-[#d94a45]" />
                                </div>
                                <h3 className="mt-5 text-2xl font-bold text-[#3d1919] tracking-tight leading-tight">
                                    {policy.title}
                                </h3>
                            </NeonCard>
                        )
                    })}
                </div>
            </div>
        </Shell>
    )
}

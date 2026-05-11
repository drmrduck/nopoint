import { BadgeCheck, Briefcase, CarFront, Trees } from 'lucide-react'
import { Eyebrow, NeonCard, Shell } from './shared'

const GROUPS = [
    { icon: BadgeCheck, title: 'Law enforcement cluster' },
    { icon: Briefcase, title: 'Federal mystery consultants' },
    { icon: CarFront, title: 'Highway regulars' },
    { icon: Trees, title: 'Town people with impeccable timing' },
]

export function CustomersSlide() {
    return (
        <Shell accent="from-[#ffcd57]/24 via-[#fff8e6]/76 to-[#49d7d2]/20">
            <div className="w-full">
                <Eyebrow>Customer Mix</Eyebrow>
                <h2 className="max-w-4xl text-6xl font-black tracking-[-0.05em] text-[#3b1717]">
                    A very specific ecosystem.
                </h2>

                <div className="mt-16 grid gap-5 md:grid-cols-2">
                    {GROUPS.map((group) => {
                        const Icon = group.icon
                        return (
                            <NeonCard key={group.title} className="p-7">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#49d7d2]/12">
                                        <Icon className="h-8 w-8 text-[#157d7a]" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-[#3d1919] tracking-tight">
                                        {group.title}
                                    </h3>
                                </div>
                            </NeonCard>
                        )
                    })}
                </div>
            </div>
        </Shell>
    )
}

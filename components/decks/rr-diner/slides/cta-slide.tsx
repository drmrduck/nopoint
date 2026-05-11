import Link from 'next/link'
import { ArrowRight, Coffee, PieChart, ShieldCheck } from 'lucide-react'
import { Eyebrow, NeonCard, Shell } from './shared'

const TAKEAWAYS = [
    { icon: Coffee, title: 'Coffee is infrastructure.' },
    { icon: PieChart, title: 'Pie is the KPI.' },
    { icon: ShieldCheck, title: 'No paranormal budget.' },
]

export function CtaSlide() {
    return (
        <Shell accent="from-[#ffcd57]/24 via-[#fff9ea]/80 to-[#49d7d2]/18">
            <div className="grid w-full gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
                <div>
                    <Eyebrow>Takeaway</Eyebrow>
                    <h2 className="text-6xl font-black tracking-[-0.05em] text-[#3b1717] leading-[1.02]">
                        NoPoint
                        <br />
                        can present
                        <br />
                        anything.
                    </h2>

                    <div className="mt-10 grid gap-3">
                        {TAKEAWAYS.map((item) => {
                            const Icon = item.icon
                            return (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-5 rounded-2xl border border-[#7d3a35]/10 bg-white/76 p-5"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff5a54]/10">
                                        <Icon className="h-6 w-6 text-[#d94a45]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#3d1919] tracking-tight">
                                        {item.title}
                                    </h3>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <NeonCard className="overflow-hidden p-5">
                    <div
                        className="h-56 rounded-[24px] border border-[#7d3a35]/10"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18)), url('/rr-diner-exterior.webp')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <div className="mt-4 rounded-[24px] border border-[#7d3a35]/10 bg-[#fff6de] p-6">
                        <p className="text-4xl font-black tracking-tight text-[#3d1919] leading-tight">
                            No point.
                            <br />
                            Full diner power.
                        </p>
                        <Link
                            href="/investors/decks"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d94a45] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#bf403b]"
                        >
                            Back to deck library
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </NeonCard>
            </div>
        </Shell>
    )
}

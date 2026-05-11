import { AlertCircle, Coffee, ShieldAlert } from 'lucide-react'
import { Eyebrow, NeonCard, Shell } from './shared'

const PROBLEMS = [
    { icon: Coffee, title: 'Coffee outruns memory' },
    { icon: AlertCircle, title: 'Pie lacks instrumentation' },
    { icon: ShieldAlert, title: 'Police spikes go unlogged' },
]

export function ProblemSlide() {
    return (
        <Shell accent="from-[#ff5a54]/18 via-[#fff8e6]/70 to-[#49d7d2]/18">
            <div className="w-full">
                <Eyebrow>The Situation</Eyebrow>
                <h2 className="max-w-4xl text-6xl font-black tracking-[-0.05em] text-[#3b1717]">
                    This diner is mission critical.
                </h2>

                <div className="mt-16 grid gap-6 md:grid-cols-3">
                    {PROBLEMS.map((problem) => {
                        const Icon = problem.icon
                        return (
                            <NeonCard key={problem.title} className="bg-white/78 p-8">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff5a54]/10">
                                    <Icon className="h-8 w-8 text-[#d94a45]" />
                                </div>
                                <h3 className="mt-6 text-3xl font-bold text-[#3d1a1a] tracking-tight">
                                    {problem.title}
                                </h3>
                            </NeonCard>
                        )
                    })}
                </div>
            </div>
        </Shell>
    )
}

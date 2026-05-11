import { Camera, Link2Off, MoonStar } from 'lucide-react'
import { Eyebrow, Shell } from './shared'

const PROBLEMS = [
    { icon: Camera, title: 'Screenshot and pray' },
    { icon: Link2Off, title: 'Broken sauce links' },
    { icon: MoonStar, title: 'Dashboard fatigue' },
]

export function ProblemSlide() {
    return (
        <Shell accent="from-emerald-700/15 via-amber-100/5 to-red-700/18">
            <div className="w-full">
                <Eyebrow>The Problem</Eyebrow>
                <h2 className="max-w-4xl text-6xl font-black tracking-[-0.05em] text-amber-50">
                    Passata screenshots miss
                    <br />
                    the big picture.
                </h2>

                <div className="mt-16 grid gap-6 md:grid-cols-3">
                    {PROBLEMS.map((problem) => {
                        const Icon = problem.icon
                        return (
                            <div
                                key={problem.title}
                                className="rounded-[28px] border border-white/10 bg-white/6 p-8 backdrop-blur"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100/10">
                                    <Icon className="h-8 w-8 text-amber-200" />
                                </div>
                                <h3 className="mt-6 text-3xl font-bold text-amber-50 tracking-tight">
                                    {problem.title}
                                </h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Shell>
    )
}

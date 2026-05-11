import { Bot, Soup, Waves } from 'lucide-react'
import { Eyebrow, Shell } from './shared'

const CARDS = [
    { icon: Soup, title: 'Data Sauces' },
    { icon: Waves, title: 'Pasta Pulses' },
    { icon: Bot, title: 'Al Dente Analysis' },
]

export function SolutionSlide() {
    return (
        <Shell accent="from-red-700/14 via-amber-100/6 to-emerald-700/14">
            <div className="w-full">
                <Eyebrow>The Platform</Eyebrow>
                <h2 className="max-w-5xl text-6xl font-black tracking-[-0.05em] text-amber-50">
                    Serious pasta intelligence
                    <br />
                    for unserious times.
                </h2>

                <div className="mt-16 grid gap-6 xl:grid-cols-3">
                    {CARDS.map((card) => {
                        const Icon = card.icon
                        return (
                            <div
                                key={card.title}
                                className="rounded-[30px] border border-white/10 bg-black/25 p-8"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/6">
                                    <Icon className="h-8 w-8 text-amber-200" />
                                </div>
                                <h3 className="mt-6 text-3xl font-bold text-amber-50 tracking-tight">
                                    {card.title}
                                </h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Shell>
    )
}

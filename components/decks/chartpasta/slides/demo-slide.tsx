import { ChartColumnIncreasing } from 'lucide-react'
import { Eyebrow, Shell } from './shared'

export function DemoSlide() {
    return (
        <Shell accent="from-emerald-700/18 via-amber-100/6 to-red-700/14">
            <div className="grid w-full gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                <div>
                    <Eyebrow>Pulse Demo</Eyebrow>
                    <h2 className="text-6xl font-black tracking-[-0.05em] text-amber-50 leading-[1.02]">
                        San Marzano
                        <br />
                        prices are up.
                    </h2>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-black/25 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3">
                        <p className="text-base font-semibold text-amber-50">
                            #passata-monitoring
                        </p>
                        <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            Live
                        </div>
                    </div>

                    <div className="space-y-3 p-3 pt-4">
                        <div className="mr-8 rounded-2xl border border-amber-100/15 bg-white/6 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100/12">
                                    <ChartColumnIncreasing className="h-4 w-4 text-amber-200" />
                                </div>
                                <p className="font-semibold text-amber-50">
                                    Chartpasta
                                </p>
                            </div>
                            <p className="text-lg leading-relaxed text-white/85">
                                San Marzano prices up 12.4% WoW. Bulk threshold breached.
                            </p>
                        </div>

                        <div className="ml-10 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                            <p className="font-semibold text-amber-50 mb-2">
                                Sergio
                            </p>
                            <p className="text-lg leading-relaxed text-white/85">
                                Madonna. The frost in Campania did this. DOP only?
                            </p>
                        </div>

                        <div className="mr-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                            <p className="font-semibold text-amber-50 mb-2">
                                Chartpasta
                            </p>
                            <p className="text-lg leading-relaxed text-white/85">
                                DOP up 18.2%. Non-DOP up 7.1%. Trigger emergency penne-line?
                            </p>
                        </div>

                        <div className="ml-10 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-lg leading-relaxed text-white/75">
                                Nonna reacted with displeasure. Sunday ragu strategy under review.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    )
}

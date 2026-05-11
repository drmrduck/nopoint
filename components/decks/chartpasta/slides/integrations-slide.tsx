import { Eyebrow, INTEGRATIONS, Shell } from './shared'

export function IntegrationsSlide() {
    return (
        <Shell accent="from-emerald-700/18 via-amber-100/6 to-red-700/14">
            <div className="grid w-full gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                    <Eyebrow>Integrazzioni</Eyebrow>
                    <h2 className="text-6xl font-black tracking-[-0.05em] text-amber-50">
                        Every pasta
                        <br />
                        data sauce
                        <br />
                        that matters.
                    </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {INTEGRATIONS.map((integration) => (
                        <div
                            key={integration}
                            className="rounded-2xl border border-white/10 bg-black/25 p-5"
                        >
                            <p className="text-xl font-semibold text-amber-50">
                                {integration}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    )
}

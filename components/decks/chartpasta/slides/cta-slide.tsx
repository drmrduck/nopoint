import { ActionLink, Eyebrow, FAQS, Shell } from './shared'

export function CtaSlide() {
    return (
        <Shell accent="from-red-700/24 via-amber-100/7 to-emerald-700/22">
            <div className="grid w-full gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                <div>
                    <Eyebrow>FAQ + CTA</Eyebrow>
                    <h2 className="text-6xl font-black tracking-[-0.05em] text-amber-50 leading-[1.02]">
                        Ready to monitor
                        <br />
                        the pasta situation?
                    </h2>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <ActionLink href="https://chartcastr.com">
                            Visit chartcastr.com →
                        </ActionLink>
                    </div>

                    <p className="mt-6 text-sm uppercase tracking-[0.22em] text-white/45">
                        Gag deck. Built with{' '}
                        <a
                            href="https://chartcastr.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-100 underline decoration-amber-200/40 underline-offset-4 hover:text-amber-50"
                        >
                            chartcastr.com
                        </a>
                        .
                    </p>
                </div>

                <div className="grid gap-3">
                    {FAQS.slice(0, 4).map((faq) => (
                        <div
                            key={faq}
                            className="rounded-2xl border border-white/10 bg-black/25 p-5"
                        >
                            <p className="text-xl font-semibold text-white/90">
                                {faq}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    )
}

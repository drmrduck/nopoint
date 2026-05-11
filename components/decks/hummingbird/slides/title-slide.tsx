export function TitleSlide() {
    return (
        <div className="relative flex h-full w-full overflow-hidden bg-[#0a0d10]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 -right-40 size-[40rem] rounded-full bg-emerald-500/15 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -left-32 size-[32rem] rounded-full bg-teal-700/12 blur-3xl"
            />

            <div className="relative z-10 flex max-w-5xl flex-col justify-center px-24">
                <h1 className="font-headline mb-6 text-8xl font-semibold leading-none tracking-tight text-white">
                    <span aria-hidden className="mr-4 inline-block drop-shadow-[0_8px_24px_rgba(16,185,129,0.45)]">
                        🐦
                    </span>
                    Hummingbird
                </h1>
                <p className="mb-12 max-w-3xl text-3xl leading-snug text-white/60">
                    Stripe billing in 60 seconds
                    <br />
                    <span className="text-white/40">for indie SaaS founders.</span>
                </p>
                <div className="flex items-center gap-4 text-sm text-white/40">
                    <span>Seed Round · 2026</span>
                    <span className="size-1 rounded-full bg-white/25" />
                    <span>Jamie Reyes &amp; Sam Okafor</span>
                </div>
            </div>
        </div>
    )
}

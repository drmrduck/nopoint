export function TeamSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/3 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-blue-500 text-xs font-semibold uppercase tracking-widest mb-4">
                    Team
                </p>
                <h2 className="font-headline text-6xl font-bold text-white tracking-tight leading-tight max-w-5xl mb-12">
                    A guy who builds
                    <br />
                    <span className="text-white/40">too many pitch decks.</span>
                </h2>

                <div className="flex items-start gap-6 max-w-3xl">
                    <div className="w-20 h-20 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                        M
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-white mb-1">Michael Carter</p>
                        <p className="text-base text-white/45 mb-3">Founder · drummerduck.com</p>
                        <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                            Got tired of copy-pasting numbers into Keynote, so built chartcastr.com. Then got tired of Keynote, so built this.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

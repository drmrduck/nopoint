import { Sparkles } from 'lucide-react'

export function NoPointFooter() {
    return (
        <footer className="border-t border-white/5 bg-zinc-950 px-6 py-8 mt-auto">
            <div className="max-w-4xl mx-auto flex flex-col gap-5">
                {/* Chartcastr badge */}
                <a
                    href="https://chartcastr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/3 hover:border-blue-500/20 hover:bg-blue-500/5 px-4 py-3.5 transition-all"
                >
                    <Sparkles className="w-4 h-4 text-blue-500/60 group-hover:text-blue-400 mt-0.5 shrink-0 transition-colors" />
                    <p className="text-xs text-white/30 group-hover:text-white/50 leading-relaxed transition-colors">
                        <span className="font-semibold text-white/40 group-hover:text-white/60">Want live data in your slides?</span>
                        {' '}Manually update each metric — or plug in{' '}
                        <span className="text-blue-400/70 group-hover:text-blue-400 underline underline-offset-2">chartcastr.com</span>
                        {' '}to automatically pull in metrics &amp; AI analysis summaries (like board commentary) from your tools.
                    </p>
                </a>

                {/* Built by / product by */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-white/20">
                        <a
                            href="https://x.com/the_mewc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/50 transition-colors"
                        >
                            built by @the_mewc
                        </a>
                        <span>·</span>
                        <a
                            href="https://drummerduck.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/50 transition-colors"
                        >
                            a product by drummerduck.com
                        </a>
                    </div>
                    <p className="text-xs text-white/10">🛝 nopoint</p>
                </div>
            </div>
        </footer>
    )
}

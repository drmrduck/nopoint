'use client'

export function LandscapeControls() {
    return (
        <div className="space-y-2 text-xs text-white/70">
            <p className="text-[10px] uppercase tracking-wider text-yellow-300/70">
                Sample controls (demo)
            </p>
            <p className="text-[11px] leading-relaxed text-white/50">
                Slides can ship a `controls` component. It renders here in the
                yellow LOCAL panel during dev only — perfect for live-tunable
                widgets (sliders for axes, competitor scores, etc.) without
                shipping the chrome to production exports.
            </p>
            <button className="w-full h-7 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 text-[11px] font-medium transition-colors">
                Sample action
            </button>
        </div>
    )
}

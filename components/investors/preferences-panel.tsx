'use client'
import { Expand, LayoutGrid, Rows3, Settings2, Square } from 'lucide-react'
import { usePreferences, type ViewModePref } from '../../lib/preferences'

interface ViewModeOption {
    value: ViewModePref
    label: string
    icon: React.ReactNode
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
    { value: 'card', label: 'Card', icon: <Square className="w-3.5 h-3.5" /> },
    { value: 'full', label: 'Full', icon: <Expand className="w-3.5 h-3.5" /> },
    { value: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { value: 'scroll', label: 'List', icon: <Rows3 className="w-3.5 h-3.5" /> },
]

export function PreferencesPanel() {
    const [prefs, update] = usePreferences()

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                    Preferences
                </h2>
                <span className="text-[10px] text-white/25 ml-1">stored locally on this device</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 divide-y divide-white/8">
                <Row
                    label="Slide transitions"
                    helper="Animate when navigating between slides. Off by default — most decks read sharper without animation."
                >
                    <Toggle
                        on={prefs.transitionsEnabled}
                        onChange={(v) => update({ transitionsEnabled: v })}
                    />
                </Row>

                <Row
                    label="Default view mode"
                    helper="Initial view mode for a deck you haven't customised yet. Per-deck choice still wins after you change it."
                >
                    <ViewModeButtonGroup
                        current={prefs.defaultViewMode}
                        onChange={(v) => update({ defaultViewMode: v })}
                    />
                </Row>

                <Row
                    label="CONFIDENTIAL watermark"
                    helper={'Small "CONFIDENTIAL — <deck name>" stamp at the bottom-right of every slide.'}
                >
                    <Toggle
                        on={prefs.showConfidentialWatermark}
                        onChange={(v) => update({ showConfidentialWatermark: v })}
                    />
                </Row>

                <Row
                    label="Slide-number watermark"
                    helper="Large faded slide-number index drawn behind each slide."
                >
                    <Toggle
                        on={prefs.showNumberWatermark}
                        onChange={(v) => update({ showNumberWatermark: v })}
                    />
                </Row>

                <Row
                    label="Context widget open by default"
                    helper="Auto-open the per-slide context widget (hotkey C) when the deck loads."
                >
                    <Toggle
                        on={prefs.contextWidgetDefaultOpen}
                        onChange={(v) => update({ contextWidgetDefaultOpen: v })}
                    />
                </Row>

                <Row
                    label="Auto-hide chrome"
                    helper="Hide the top-right options menu and bottom bar until hover. Disable to keep them always visible."
                >
                    <Toggle
                        on={prefs.autoHideChrome}
                        onChange={(v) => update({ autoHideChrome: v })}
                    />
                </Row>
            </div>
        </section>
    )
}

function Row({
    label,
    helper,
    children,
}: {
    label: string
    helper: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-6 px-5 py-4">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-white/40 leading-relaxed mt-0.5">{helper}</p>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}

function ViewModeButtonGroup({
    current,
    onChange,
}: {
    current: ViewModePref
    onChange: (v: ViewModePref) => void
}) {
    return (
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            {VIEW_MODE_OPTIONS.map((opt) => {
                const active = current === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        title={opt.label}
                        onClick={() => onChange(opt.value)}
                        className={`h-7 flex items-center gap-1.5 rounded-md transition-all ${
                            active
                                ? 'bg-blue-500/25 text-blue-200 px-1.5 w-7 justify-center'
                                : 'px-2.5 text-white/55 hover:text-white hover:bg-white/8'
                        }`}
                    >
                        {opt.icon}
                        {!active && (
                            <span className="text-[11px] font-medium">{opt.label}</span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!on)}
            role="switch"
            aria-checked={on}
            className={`relative w-10 h-5 rounded-full transition-colors ${
                on ? 'bg-blue-500' : 'bg-white/15'
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    on ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    )
}

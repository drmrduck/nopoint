import { useEffect, useRef, useState } from 'react'
import {
    ChevronDown,
    Expand,
    LayoutGrid,
    Maximize,
    Minimize,
    Rows3,
    Smartphone,
    Square,
} from 'lucide-react'
import type { ViewMode } from '../viewer-types'
import { cx } from './utils'

export interface ModeItem {
    key: 'card' | 'full' | 'grid' | 'scroll' | 'mobile' | 'screen'
    icon: React.ReactNode
    label: string
    title: string
    /** Hide this item on narrow viewports (< sm) to reclaim space. */
    smOnly?: boolean
}

export function ViewModeGroup({
    current,
    onChange,
    fullscreen,
    onToggleFullscreen,
    compact = false,
}: {
    current: ViewMode
    onChange: (m: ViewMode) => void
    fullscreen: boolean
    onToggleFullscreen: () => void
    /** Render as an icon-only select dropdown instead of a button group. */
    compact?: boolean
}) {
    const items: ModeItem[] = [
        { key: 'card', icon: <Square className="w-3.5 h-3.5" />, label: 'Card', title: 'Card view (V)' },
        { key: 'full', icon: <Expand className="w-3.5 h-3.5" />, label: 'Full', title: 'Full bleed (V)' },
        { key: 'grid', icon: <LayoutGrid className="w-3.5 h-3.5" />, label: 'Grid', title: 'Grid view (G)' },
        { key: 'scroll', icon: <Rows3 className="w-3.5 h-3.5" />, label: 'List', title: 'Scroll / list view (S)', smOnly: true },
        { key: 'mobile', icon: <Smartphone className="w-3.5 h-3.5" />, label: 'Mobile', title: 'Mobile preview (P)' },
        {
            // Fullscreen is hidden on narrow viewports — the API has spotty
            // mobile-browser support and the button is rarely useful there.
            key: 'screen',
            icon: fullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />,
            label: 'Screen',
            title: fullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)',
            smOnly: true,
        },
    ]

    function handle(key: ModeItem['key']) {
        if (key === 'screen') onToggleFullscreen()
        else onChange(key)
    }

    function isActive(key: ModeItem['key']) {
        if (key === 'screen') return fullscreen
        return current === key
    }

    if (compact) {
        return (
            <ViewModeSelect
                items={items}
                onPick={handle}
                isActive={isActive}
            />
        )
    }

    return (
        <div className="flex items-center gap-0.5 sm:gap-1 p-1 bg-white/5 rounded-lg">
            {items.map((it) => {
                const active = isActive(it.key)
                return (
                    <button
                        key={it.key}
                        title={it.title}
                        onClick={() => handle(it.key)}
                        className={cx(
                            'h-7 flex items-center gap-1.5 rounded-md transition-all',
                            it.smOnly && 'hidden sm:flex',
                            active
                                ? 'bg-blue-500/25 text-blue-200 px-1.5 w-7 justify-center'
                                : 'px-1.5 sm:px-2.5 text-white/55 hover:text-white hover:bg-white/8',
                        )}
                    >
                        {it.icon}
                        {!active && (
                            <span className="hidden sm:inline text-[11px] font-medium">{it.label}</span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

function ViewModeSelect({
    items,
    onPick,
    isActive,
}: {
    items: ModeItem[]
    onPick: (key: ModeItem['key']) => void
    isActive: (key: ModeItem['key']) => boolean
}) {
    const [open, setOpen] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)
    const current = items.find((i) => isActive(i.key)) ?? items[0]!

    useEffect(() => {
        if (!open) return
        const onDoc = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('mousedown', onDoc)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onDoc)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    return (
        <div ref={wrapRef} className="relative">
            <button
                type="button"
                title={current.title}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="h-8 inline-flex items-center gap-1.5 pl-2 pr-1.5 rounded-md border border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08] text-white/80 hover:text-white transition-colors"
            >
                {current.icon}
                <span className="text-[11px] font-medium">{current.label}</span>
                <ChevronDown className={cx('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
                <div
                    role="listbox"
                    className="absolute bottom-full mb-2 right-0 z-40 min-w-[140px] rounded-lg border border-white/10 bg-zinc-900/95 backdrop-blur p-1 shadow-xl"
                >
                    {items.map((it) => {
                        const active = isActive(it.key)
                        return (
                            <button
                                key={it.key}
                                role="option"
                                aria-selected={active}
                                title={it.title}
                                onClick={() => { onPick(it.key); setOpen(false) }}
                                className={cx(
                                    'w-full flex items-center gap-2 px-2 h-8 rounded-md text-[11px] font-medium transition-colors',
                                    active
                                        ? 'bg-blue-500/25 text-blue-200'
                                        : 'text-white/70 hover:text-white hover:bg-white/8',
                                )}
                            >
                                <span className="w-4 inline-flex justify-center">{it.icon}</span>
                                <span>{it.label}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

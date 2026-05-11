'use client'

import { useState } from 'react'
import { Copy, Check, RotateCcw } from 'lucide-react'
import { dotGridStore, useDotGrid } from '../title-slide-store'

interface RangeRowProps {
    label: string
    min: number
    max: number
    step: number
    value: number
    onChange: (v: number) => void
    format?: (v: number) => string
}

function RangeRow({ label, min, max, step, value, onChange, format }: RangeRowProps) {
    return (
        <label className="block">
            <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/45">
                    {label}
                </span>
                <span className="text-[11px] tabular-nums text-white/80">
                    {format ? format(value) : value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-blue-400"
            />
        </label>
    )
}

interface ColorRowProps {
    label: string
    value: string
    onChange: (v: string) => void
}

function ColorRow({ label, value, onChange }: ColorRowProps) {
    return (
        <label className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/45">
                {label}
            </span>
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-7 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
            />
            <span className="text-[10px] tabular-nums text-white/40">{value}</span>
        </label>
    )
}

export function TitleControls() {
    const s = useDotGrid()
    const [copied, setCopied] = useState(false)

    function copyJson() {
        navigator.clipboard?.writeText(JSON.stringify(s, null, 2)).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        })
    }

    return (
        <div className="space-y-3 text-white/85">
            <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300/80">
                    Dot Grid
                </p>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => dotGridStore.reset()}
                        title="Reset to defaults"
                        className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-white/10 px-1.5 text-[10px] font-semibold text-white/60 hover:border-white/25 hover:text-white"
                    >
                        <RotateCcw className="h-3 w-3" />
                        reset
                    </button>
                    <button
                        type="button"
                        onClick={copyJson}
                        className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-white/10 px-1.5 text-[10px] font-semibold text-white/60 hover:border-white/25 hover:text-white"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'copied' : 'copy json'}
                    </button>
                </div>
            </div>

            <RangeRow
                label="spacing"
                min={10}
                max={48}
                step={1}
                value={s.spacing}
                onChange={(v) => dotGridStore.set({ spacing: v })}
            />
            <RangeRow
                label="dotRadius"
                min={0.5}
                max={4}
                step={0.1}
                value={s.dotRadius}
                onChange={(v) => dotGridStore.set({ dotRadius: v })}
                format={(v) => v.toFixed(2)}
            />
            <RangeRow
                label="radius"
                min={40}
                max={500}
                step={10}
                value={s.radius}
                onChange={(v) => dotGridStore.set({ radius: v })}
            />
            <RangeRow
                label="baseOpacity"
                min={0}
                max={1}
                step={0.01}
                value={s.baseOpacity}
                onChange={(v) => dotGridStore.set({ baseOpacity: v })}
                format={(v) => v.toFixed(2)}
            />
            <RangeRow
                label="activeOpacity"
                min={0}
                max={1}
                step={0.01}
                value={s.activeOpacity}
                onChange={(v) => dotGridStore.set({ activeOpacity: v })}
                format={(v) => v.toFixed(2)}
            />
            <RangeRow
                label="repel"
                min={0}
                max={40}
                step={0.5}
                value={s.repel}
                onChange={(v) => dotGridStore.set({ repel: v })}
                format={(v) => v.toFixed(1)}
            />

            <div className="flex items-center justify-between gap-3 pt-1">
                <ColorRow
                    label="color"
                    value={s.color}
                    onChange={(v) => dotGridStore.set({ color: v })}
                />
                <ColorRow
                    label="accent"
                    value={s.accent}
                    onChange={(v) => dotGridStore.set({ accent: v })}
                />
            </div>
        </div>
    )
}

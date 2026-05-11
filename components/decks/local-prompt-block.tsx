'use client'
import { useState } from 'react'
import { Check, Copy, FlaskConical } from 'lucide-react'
import { isLocalEnv } from '../../lib/utils/env'

interface LocalPromptBlockProps {
    badge: string
    title: string
    description: string
    prompt: string
    defaultOpen?: boolean
}

/**
 * Yellow-bordered "LOCAL · …" panel that surfaces a copy-to-clipboard prompt
 * for Claude Code / Cursor. Renders only when running on a local dev host —
 * production deploys never see it.
 */
export function LocalPromptBlock({ badge, title, description, prompt, defaultOpen = false }: LocalPromptBlockProps) {
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(defaultOpen)

    if (typeof window !== 'undefined' && !isLocalEnv()) return null

    function copy() {
        try {
            navigator.clipboard.writeText(prompt).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
            })
        } catch {
            // ignore
        }
    }

    return (
        <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/[0.04]">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-yellow-500/[0.06] transition-colors"
            >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <FlaskConical className="w-3 h-3 text-yellow-300/70 shrink-0" />
                    <span className="text-[10px] font-semibold text-yellow-300/80 uppercase tracking-[0.12em] min-w-0">
                        Local · {badge}
                    </span>
                </div>
                <span className="text-[10px] text-yellow-200/40">{open ? 'Hide' : 'Show'}</span>
            </button>
            {open && (
                <div className="px-3 pb-3 space-y-2 border-t border-yellow-500/15 pt-2">
                    <p className="text-[11px] font-medium text-white/70">{title}</p>
                    <p className="text-[11px] text-white/45 leading-relaxed">{description}</p>
                    <button
                        onClick={copy}
                        className={`w-full h-8 rounded-md flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors ${
                            copied
                                ? 'bg-emerald-500/25 text-emerald-200'
                                : 'bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-100'
                        }`}
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied — paste into Claude Code' : 'Copy customization prompt'}
                    </button>
                    <details className="text-[10px] text-white/30">
                        <summary className="cursor-pointer hover:text-white/50">Preview prompt</summary>
                        <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-white/45 bg-black/30 rounded p-2 border border-white/5">
                            {prompt}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    )
}

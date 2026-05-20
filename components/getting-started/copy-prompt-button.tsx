'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import posthog from 'posthog-js'

interface CopyPromptButtonProps {
    prompt: string
    label?: string
    /** Visual treatment. */
    variant?: 'primary' | 'ghost'
    className?: string
}

export function CopyPromptButton({
    prompt,
    label = 'Copy prompt',
    variant = 'primary',
    className,
}: CopyPromptButtonProps) {
    const [copied, setCopied] = useState(false)

    async function copy() {
        try {
            await navigator.clipboard.writeText(prompt)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
            posthog.capture('prompt_copied', { label })
        } catch {
            // ignore — clipboard may be unavailable in some sandboxes
        }
    }

    const base =
        'inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-bold transition-colors cursor-pointer select-none'

    if (variant === 'ghost') {
        return (
            <button
                onClick={copy}
                aria-live="polite"
                className={cn(
                    base,
                    copied
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                        : 'border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white',
                    className
                )}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : label}
            </button>
        )
    }

    return (
        <button
            onClick={copy}
            aria-live="polite"
            className={cn(
                base,
                copied
                    ? 'bg-emerald-500/85 text-emerald-50 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]'
                    : 'bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]',
                className
            )}
        >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : label}
        </button>
    )
}

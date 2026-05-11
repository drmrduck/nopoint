'use client'
import { useState } from 'react'
import { Check, Link as LinkIcon, Lock, Share2 } from 'lucide-react'

interface CopyLinkButtonProps {
    /** Path or absolute URL to copy. Path is resolved against window.location.origin. */
    href: string
    /** True for publicly shareable URLs; false to render a disabled/private affordance. */
    isPublic?: boolean
    /** Visual treatment. */
    variant?: 'inline' | 'pill' | 'icon'
    label?: string
    className?: string
}

function resolveAbsolute(href: string): string {
    if (typeof window === 'undefined') return href
    if (href.startsWith('http://') || href.startsWith('https://')) return href
    return `${window.location.origin}${href}`
}

export function CopyLinkButton({
    href,
    isPublic = true,
    variant = 'pill',
    label,
    className = '',
}: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false)

    async function copy(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!isPublic) return
        const absolute = resolveAbsolute(href)
        try {
            await navigator.clipboard.writeText(absolute)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        } catch {
            // ignore — clipboard may be unavailable in some sandboxes
        }
    }

    if (!isPublic) {
        const base =
            'inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]'
        return (
            <span
                title="Private deck — share is disabled. Investors must sign in to view."
                className={`${base} text-white/30 ${className}`}
            >
                <Lock className="w-3 h-3" />
                Private
            </span>
        )
    }

    if (variant === 'icon') {
        return (
            <button
                onClick={copy}
                title={copied ? 'Copied' : 'Copy share link'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    copied
                        ? 'bg-emerald-500/25 text-emerald-200'
                        : 'bg-white/8 hover:bg-white/14 text-white/60 hover:text-white'
                } ${className}`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>
        )
    }

    if (variant === 'inline') {
        return (
            <button
                onClick={copy}
                title={copied ? 'Copied' : 'Copy share link'}
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    copied ? 'text-emerald-300' : 'text-white/45 hover:text-white'
                } ${className}`}
            >
                {copied ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                {copied ? 'Copied' : (label ?? 'Copy link')}
            </button>
        )
    }

    return (
        <button
            onClick={copy}
            title={copied ? 'Copied' : 'Copy share link'}
            className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-semibold transition-colors ${
                copied
                    ? 'bg-emerald-500/25 text-emerald-200'
                    : 'bg-white/8 hover:bg-white/14 text-white/65 hover:text-white'
            } ${className}`}
        >
            {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
            {copied ? 'Copied' : (label ?? 'Share')}
        </button>
    )
}

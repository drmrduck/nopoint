'use client'
import { useState } from 'react'
import { Check, Globe, Link as LinkIcon, Lock, Share2 } from 'lucide-react'
import type { DeckDefinition } from './types'
import type { ViewMode } from './viewer-types'
import { SITE_URL } from '@/lib/site'

interface SharePanelProps {
    deck: DeckDefinition
    currentSlideId: string | undefined
    currentSlideTitle: string | undefined
    currentSlideNumber: number
    viewMode: ViewMode
    currentVariantKey: string | undefined
}

export function SharePanel({
    deck,
    currentSlideId,
    currentSlideTitle,
    currentSlideNumber,
    viewMode,
    currentVariantKey,
}: SharePanelProps) {
    const [copied, setCopied] = useState<'deck' | 'slide' | null>(null)
    const isPublic = !!deck.public

    const origin =
        typeof window !== 'undefined' ? window.location.origin : SITE_URL
    const deckPath = `/investors/decks/${deck.id}`
    const deckUrl = `${origin}${deckPath}`

    const slideQs = new URLSearchParams()
    if (currentSlideId) slideQs.set('slide', currentSlideId)
    slideQs.set('view', viewMode)
    if (currentVariantKey) slideQs.set('variant', currentVariantKey)
    const slidePath = `${deckPath}?${slideQs.toString()}`
    const slideUrl = `${origin}${slidePath}`

    async function copy(which: 'deck' | 'slide', value: string) {
        if (!isPublic) return
        try {
            await navigator.clipboard.writeText(value)
            setCopied(which)
            setTimeout(() => setCopied((c) => (c === which ? null : c)), 1800)
        } catch {
            // ignore
        }
    }

    return (
        <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Share
            </p>

            <div
                className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border ${
                    isPublic
                        ? 'border-emerald-500/25 bg-emerald-500/8'
                        : 'border-white/10 bg-white/[0.03]'
                }`}
            >
                {isPublic ? (
                    <Globe className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                    <Lock className="w-3.5 h-3.5 text-white/45" />
                )}
                <span
                    className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                        isPublic ? 'text-emerald-300' : 'text-white/55'
                    }`}
                >
                    {isPublic ? 'Public deck' : 'Private deck'}
                </span>
                <span className="ml-auto text-[10px] text-white/35">
                    {isPublic ? 'Anyone with the link' : 'Investors only'}
                </span>
            </div>

            {isPublic ? (
                <>
                    <ShareRow
                        icon={<LinkIcon className="w-3.5 h-3.5" />}
                        label="Deck link"
                        sub={deckPath}
                        copied={copied === 'deck'}
                        onCopy={() => copy('deck', deckUrl)}
                    />
                    <ShareRow
                        icon={<Share2 className="w-3.5 h-3.5" />}
                        label="This slide"
                        sub={
                            currentSlideTitle
                                ? `Slide ${currentSlideNumber} · ${currentSlideTitle}`
                                : 'Current slide'
                        }
                        copied={copied === 'slide'}
                        onCopy={() => copy('slide', slideUrl)}
                    />
                    <SharePreviewCard deckId={deck.id} title={deck.title} />
                </>
            ) : (
                <p className="text-[11px] text-white/45 leading-relaxed">
                    This deck is private. Investors must sign in with their credentials to view
                    it. To make it shareable, add it to{' '}
                    <code className="font-mono text-[10px] bg-white/8 px-1 py-0.5 rounded">
                        PUBLIC_DECK_IDS
                    </code>{' '}
                    in <code className="font-mono text-[10px]">lib/decks/visibility.ts</code>.
                </p>
            )}
        </div>
    )
}

function SharePreviewCard({ deckId, title }: { deckId: string; title: string }) {
    const src = `/investors/decks/${encodeURIComponent(deckId)}/opengraph-image`
    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Link preview
                </span>
                <span className="text-[9px] text-white/25">Slack · X · iMessage</span>
            </div>
            <div
                className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/40"
                style={{ aspectRatio: '1200 / 630' }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={`Link preview for ${title}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

function ShareRow({
    icon,
    label,
    sub,
    copied,
    onCopy,
}: {
    icon: React.ReactNode
    label: string
    sub: string
    copied: boolean
    onCopy: () => void
}) {
    return (
        <button
            onClick={onCopy}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mb-1.5 rounded-lg border transition-colors text-left ${
                copied
                    ? 'border-emerald-500/45 bg-emerald-500/15'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
            }`}
        >
            <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    copied ? 'bg-emerald-500/25 text-emerald-200' : 'bg-white/8 text-white/55'
                }`}
            >
                {copied ? <Check className="w-3.5 h-3.5" /> : icon}
            </div>
            <div className="min-w-0 flex-1">
                <p
                    className={`text-xs font-semibold ${
                        copied ? 'text-emerald-200' : 'text-white/80'
                    }`}
                >
                    {copied ? 'Copied' : label}
                </p>
                <p className="text-[10px] text-white/40 truncate font-mono">{sub}</p>
            </div>
        </button>
    )
}

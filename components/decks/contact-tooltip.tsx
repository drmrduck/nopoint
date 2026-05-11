'use client'
import { AtSign, Briefcase, Globe, Mail, Phone, User } from 'lucide-react'
import { LocalPromptBlock } from './local-prompt-block'
import type { DeckDefinition } from './types'

/* ─────────────────────────────────────────────────────────────────────────────
 * CONTACT INFO — shown in the founder/contact rail panel.
 *
 * Edit the constants below directly when preparing a deck for a new prospect.
 * Per-deck overrides (`deck.contact`) still take priority if set.
 * ──────────────────────────────────────────────────────────────────────────── */
export const CONTACT_INFO = {
    name: 'Michael Carter',
    role: 'Founder & CEO',
    email: 'michael@drummerduck.com',
    phone: '',
    twitter: 'https://x.com/the_mewc',
    twitterHandle: '@the_mewc',
    linkedin: 'https://linkedin.com/in/michael-carter-au',
    linkedinLabel: 'linkedin.com/in/michael-carter-au',
}

const CONTACT_CUSTOMIZE_PROMPT = `I'm preparing the NoPoint pitch deck for a new prospect/customer and need to update the contact tooltip.

File: components/decks/contact-tooltip.tsx
Update the CONTACT_INFO constant (and the ContactTooltip render block if new channels are added).

Please ask me, one question at a time:
1. Contact name
2. Role / title
3. Email (used for the mailto: link)
4. Phone — or "skip" to remove the phone row
5. Twitter / X handle (e.g. @the_mewc) — or "skip"
6. LinkedIn URL (full URL) — or "skip"
7. Any other channels to add? (Bluesky, Mastodon, GitHub, Calendly/booking link, company website, Discord, Telegram, WhatsApp, Signal, etc.) — for each, ask for the icon (lucide-react name or a unicode emoji), display label, and href. Add a new <a> row inside ContactTooltip's channel list for each, matching the existing row styling.

After my answers, apply the edits and confirm the diff.`

export function ContactTooltip({ deckContact }: { deckContact?: DeckDefinition['contact'] }) {
    // Per-deck override beats default. Email/phone/twitter/linkedin only.
    const email = deckContact?.email ?? CONTACT_INFO.email
    const phone = deckContact?.phone ?? CONTACT_INFO.phone
    const twitter = deckContact?.twitter ?? CONTACT_INFO.twitter
    const linkedin = deckContact?.linkedin ?? CONTACT_INFO.linkedin

    return (
        <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Contact
            </p>

            <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-300" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{CONTACT_INFO.name}</p>
                    <p className="text-xs text-white/45 flex items-center gap-1.5 mt-0.5">
                        <Briefcase className="w-3 h-3" />
                        {CONTACT_INFO.role}
                    </p>
                </div>
            </div>

            <div className="space-y-1">
                {email && (
                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors"
                    >
                        <Mail className="w-3.5 h-3.5 text-white/35 shrink-0" />
                        <span className="truncate">{email}</span>
                    </a>
                )}
                {phone && (
                    <a
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors"
                    >
                        <Phone className="w-3.5 h-3.5 text-white/35 shrink-0" />
                        <span className="truncate">{phone}</span>
                    </a>
                )}
                {twitter && (
                    <a
                        href={twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors"
                    >
                        <AtSign className="w-3.5 h-3.5 text-white/35 shrink-0" />
                        <span className="truncate">{CONTACT_INFO.twitterHandle}</span>
                    </a>
                )}
                {linkedin && (
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors"
                    >
                        <Globe className="w-3.5 h-3.5 text-white/35 shrink-0" />
                        <span className="truncate">{CONTACT_INFO.linkedinLabel}</span>
                    </a>
                )}
            </div>

            <LocalPromptBlock
                badge="Customize contact"
                title="Update the contact card for a new prospect"
                description="Copy this prompt into Claude Code (or Codex) and it will walk you through every field one at a time, then apply the diff for you."
                prompt={CONTACT_CUSTOMIZE_PROMPT}
                defaultOpen
            />
        </div>
    )
}

import type { DeckDefinition } from './types'
import { isPublicDeck } from '@/lib/decks/visibility'
import { SLIDES as SEED_2026 } from './seed-2026/slides'
import { SLIDES as NOPOINT_DUEDIL } from './nopoint-duedil/slides'
import { SLIDES as SEQUOIA } from './sequoia/slides'
import { SLIDES as IM } from './im/slides'
import { SLIDES as CHARTPASTA } from './chartpasta/slides'
import { SLIDES as RR_DINER } from './rr-diner/slides'
import { SLIDES as AIRBNB } from './airbnb/slides'
import { SLIDES as BUFFER } from './buffer/slides'
import { SLIDES as HUMMINGBIRD } from './hummingbird/slides'

export type { DeckChrome, DeckDefinition, SlideDefinition, SlideContext, SlideVariant, DeckContact } from './types'

const DEFAULT_CONTACT = {
    email: 'michael@drummerduck.com',
    twitter: '@nopoint',
    linkedin: 'linkedin.com/company/nopoint',
}

const DECK_REGISTRY: DeckDefinition[] = [
    {
        id: 'seed-2026',
        title: 'Seed Round 2026',
        description: 'Live pitch deck for the seed raise.',
        slides: SEED_2026,
        pdfFilename: 'nopoint-seed-2026.pdf',
        contact: DEFAULT_CONTACT,
        chrome: {
            brand: {
                kind: 'text',
                text: '🛝 NoPoint',
                className: 'text-[11px] font-black uppercase tracking-[0.34em] text-white/36',
            },
        },
    },
    {
        id: 'nopoint-duedil',
        title: '🛝 NoPoint — Due Diligence (stub)',
        description: 'Stub companion deck mirroring the 🛝 NoPoint pitch. 11 placeholders for the deeper version partners read post-meeting.',
        slides: NOPOINT_DUEDIL,
        pdfFilename: 'nopoint-duedil.pdf',
        contact: DEFAULT_CONTACT,
        chrome: {
            brand: {
                kind: 'text',
                text: '🛝 NoPoint · Due Diligence',
                className: 'text-[11px] font-semibold uppercase tracking-[0.28em] text-indigo-300/60',
            },
            slideNumber: {
                format: 'plain',
                prefix: 'Chapter ',
            },
            watermark: {
                text: 'STUB — fill before sending',
                className: 'absolute bottom-4 right-4 text-[11px] text-yellow-300/30 pointer-events-none select-none z-10',
            },
        },
    },
    {
        id: 'sequoia',
        title: 'Sequoia 10-Slide Template',
        description: 'Sequoia\'s "writing a business plan" framework as 10 placeholder slides.',
        slides: SEQUOIA,
        pdfFilename: 'sequoia-template.pdf',
        contact: DEFAULT_CONTACT,
        chrome: {
            brand: {
                kind: 'text',
                text: 'Sequoia Template',
                className: 'text-[11px] font-semibold uppercase tracking-[0.32em] text-white/34',
            },
            slideNumber: {
                suffix: ' / 10',
            },
        },
    },
    {
        id: 'im',
        title: 'Information Memorandum Template',
        description: 'Long-form 30-slide deep-dive for institutional diligence.',
        slides: IM,
        pdfFilename: 'information-memorandum.pdf',
        contact: DEFAULT_CONTACT,
        chrome: {
            brand: {
                kind: 'text',
                text: 'Information Memorandum',
                className: 'text-[11px] font-semibold uppercase tracking-[0.26em] text-white/34',
            },
            slideNumber: {
                format: 'plain',
                prefix: 'Slide ',
            },
        },
    },
    {
        id: 'chartpasta',
        title: 'Chartpasta',
        description: 'A gag deck — Michael\'s other code-defined product, chartcastr.com, in pasta form.',
        slides: CHARTPASTA,
        pdfFilename: 'chartpasta.pdf',
        contact: {
            ...DEFAULT_CONTACT,
            email: 'hello@chartcastr.com',
        },
        chrome: {
            brand: {
                kind: 'text',
                text: 'Chartpasta',
                className: 'text-[12px] font-black uppercase tracking-[0.32em] text-amber-200/70',
            },
            slideNumber: {
                className: 'text-xs font-black tracking-[0.32em] tabular-nums text-amber-200/60',
            },
            watermark: {
                text: 'AL DENTE — Chartpasta Demo',
                className: 'absolute bottom-4 right-4 text-[11px] text-amber-100/25 pointer-events-none select-none z-10',
            },
        },
    },
    {
        // NOTE: Keep `description` ≤ ~140 characters. It is rendered into the
        // social OG card at 32px, where anything longer wraps onto a 4th line
        // and bleeds into the footer. The portal/landing grid cards also
        // truncate visually past this length. The OG route additionally caps
        // and ellipses defensively, but tight copy is the real fix.
        id: 'buffer',
        title: 'Buffer — Seed 2013',
        description:
            'The Buffer 2013 deck that closed $500K in 7 days. Traction-first, metrics-led, Lean-Startup framing.',
        slides: BUFFER,
        pdfFilename: 'buffer-seed-2013.pdf',
        contact: {
            email: 'joel@bufferapp.com',
        },
        chrome: {
            brand: {
                kind: 'text',
                text: 'Buffer',
                className: 'text-[11px] font-bold uppercase tracking-[0.32em] text-[#168EEA]',
            },
            slideNumber: {
                className: 'text-xs font-bold tracking-[0.32em] tabular-nums text-[#1F2A37]/40',
            },
            watermark: {
                text: 'Buffer — Seed Pitch · 2013 (recreation)',
                className:
                    'absolute bottom-4 right-5 text-[10px] uppercase tracking-[0.24em] text-[#1F2A37]/30 pointer-events-none select-none z-10',
            },
        },
    },
    {
        id: 'airbnb',
        title: 'AirBed&Breakfast — Seed 2009',
        description:
            'The original Airbnb 2009 seed deck. Cream paper, Rausch red, 2008-era numbers quoted as-shipped.',
        slides: AIRBNB,
        pdfFilename: 'airbnb-seed-2009.pdf',
        contact: {
            email: 'founders@airbedandbreakfast.com',
        },
        chrome: {
            brand: {
                kind: 'text',
                text: 'AirBed&Breakfast',
                className: 'text-[11px] font-bold uppercase tracking-[0.32em] text-[#FF5A5F]',
            },
            slideNumber: {
                className: 'text-xs font-bold tracking-[0.32em] tabular-nums text-[#1B1A1B]/40',
            },
            watermark: {
                text: 'AirBed&Breakfast — Seed Pitch · 2009 (recreation)',
                className:
                    'absolute bottom-4 right-5 text-[10px] uppercase tracking-[0.24em] text-[#1B1A1B]/30 pointer-events-none select-none z-10',
            },
        },
    },
    {
        id: 'hummingbird',
        title: 'Hummingbird — Seed 2026',
        description: 'Stripe billing in 60 seconds for indie SaaS founders. Live MRR pulled from Stripe.',
        slides: HUMMINGBIRD,
        pdfFilename: 'hummingbird-seed-2026.pdf',
        contact: {
            email: 'jamie@hummingbird.dev',
        },
        chrome: {
            brand: {
                kind: 'text',
                text: '🐦 Hummingbird',
                className: 'text-[11px] font-black uppercase tracking-[0.34em] text-emerald-200/60',
            },
            slideNumber: {
                className: 'text-xs font-bold tracking-[0.32em] tabular-nums text-white/40',
            },
        },
    },
    {
        id: 'rr-diner',
        title: 'RR Diner Situation Room',
        description: 'Bright gag deck for coffee, pie, police presence, and zero supernatural theories.',
        slides: RR_DINER,
        pdfFilename: 'rr-diner.pdf',
        contact: DEFAULT_CONTACT,
        chrome: {
            brand: {
                kind: 'text',
                text: 'RR Diner',
                className: 'text-[12px] font-black uppercase tracking-[0.3em] text-[#d94a45]',
            },
            slideNumber: {
                className: 'text-xs font-black tracking-[0.32em] tabular-nums text-[#d94a45]/70',
            },
            watermark: {
                text: 'RR DINER OPERATIONS — STRICTLY NON-SUPERNATURAL',
                className: 'absolute bottom-4 right-4 text-[11px] text-[#6a3733]/30 pointer-events-none select-none z-10',
            },
        },
    },
]

// Multiplayer (live cursors) is on by default. Set NEXT_PUBLIC_MULTIPLAYER_ENABLED=false
// to disable globally. Per-deck literals can override with `multiplayer: false`.
const MULTIPLAYER_DEFAULT = process.env.NEXT_PUBLIC_MULTIPLAYER_ENABLED !== 'false'

export const DECKS: DeckDefinition[] = DECK_REGISTRY.map((d) => ({
    ...d,
    public: isPublicDeck(d.id),
    multiplayer: d.multiplayer === false ? false : MULTIPLAYER_DEFAULT,
}))

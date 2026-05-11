import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'

export const CHARTPASTA_URL = 'https://chartpasta.com'

export const INTEGRATIONS = [
    "Nonna's Kitchen API",
    'Olive Press Monitor',
    'Barilla HQ Connect',
    'Passata Futures Exchange',
    'DeCecco Analytics',
    'Parmigiano Registry',
    'San Marzano Tracker',
    'EVOO Index',
    "Sergio's WhatsApp",
    'Trattoria Chat',
    'Family Group Chat',
    'Durum Wheat Index',
]

export const SERGIO_QUOTES = [
    'Madonna, the penne prices are going through the roof.',
    "Nonna just texted. She's not happy about the passata. Nobody's happy about the passata.",
    "The rigatoni numbers are in and... chef's kiss... magnifico.",
    'Data does not lie. Neither does Nonna.',
    'The algorithm does not lie. The pasta must flow.',
    "My LinkedIn says Pasta Intelligence. People think it's a joke. I have never been more serious.",
    'The real KPI is KPP: Key Pasta Performance.',
    'You call it technical debt. I call it overcooked spaghetti.',
]

export const FAQS = [
    'What data sauces does Chartpasta support?',
    "How does Sergio's al dente analysis work?",
    'What is PEAS?',
    'Can I talk to Sergio?',
    'Do you support web-cooks?',
    'How is Chartpasta different from Chartcastr?',
]

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

export function Shell({
    children,
    accent = 'from-red-600/20 via-amber-100/5 to-emerald-600/20',
}: {
    children: ReactNode
    accent?: string
}) {
    return (
        <div className="relative flex h-full w-full overflow-hidden bg-[#130d0a]">
            <div className={cx('absolute inset-0 bg-gradient-to-br', accent)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,225,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,#1a110d_0%,#140d0a_46%,#0e1310_100%)]" />
            <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-red-600/15 blur-3xl" />
            <div className="absolute bottom-8 right-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="relative z-10 flex h-full w-full items-center px-12 py-10 xl:px-20">
                {children}
            </div>
        </div>
    )
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
            {children}
        </p>
    )
}

export function ActionLink({
    children,
    href = CHARTPASTA_URL,
    tone = 'solid',
}: {
    children: ReactNode
    href?: string
    tone?: 'solid' | 'ghost'
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cx(
                'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
                tone === 'solid'
                    ? 'bg-amber-100 text-[#1a110d] hover:bg-amber-50'
                    : 'border border-white/15 bg-white/6 text-amber-50 hover:border-white/30 hover:bg-white/10',
            )}
        >
            {children}
            <ExternalLink className="h-4 w-4" />
        </a>
    )
}

import { Coffee, PieChart, Siren, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

export function Shell({
    children,
    accent = 'from-[#49d7d2]/22 via-[#fff7df]/65 to-[#ff5a54]/18',
}: {
    children: ReactNode
    accent?: string
}) {
    return (
        <div className="relative flex h-full w-full overflow-hidden bg-[#fff5e6] text-[#381a19]">
            <div className={cx('absolute inset-0 bg-gradient-to-br', accent)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,91,84,0.18),transparent_34%),linear-gradient(180deg,rgba(255,247,223,0.94),rgba(255,237,210,0.98))]" />
            <div className="absolute inset-x-0 top-0 h-5 bg-[linear-gradient(90deg,#ff5a54_0%,#ff5a54_14%,#fff4d7_14%,#fff4d7_28%,#49d7d2_28%,#49d7d2_42%,#ffcd57_42%,#ffcd57_56%,#ff5a54_56%,#ff5a54_70%,#fff4d7_70%,#fff4d7_84%,#49d7d2_84%,#49d7d2_100%)] opacity-90" />
            <div className="absolute right-10 top-10 h-52 w-52 rounded-full bg-[#ff5a54]/14 blur-3xl" />
            <div className="absolute bottom-6 left-10 h-56 w-56 rounded-full bg-[#49d7d2]/18 blur-3xl" />
            <div className="relative z-10 flex h-full w-full px-12 py-10 xl:px-20">
                {children}
            </div>
        </div>
    )
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.34em] text-[#d94a45]">
            {children}
        </p>
    )
}

export function NeonCard({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div
            className={cx(
                'rounded-[30px] border border-[#7d3a35]/12 bg-white/72 p-6 shadow-[0_18px_60px_rgba(107,43,37,0.12)] backdrop-blur',
                className,
            )}
        >
            {children}
        </div>
    )
}

export function Pill({
    children,
    tone = 'cream',
}: {
    children: ReactNode
    tone?: 'cream' | 'red' | 'teal'
}) {
    return (
        <span
            className={cx(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
                tone === 'cream' && 'border-[#7d3a35]/10 bg-[#fff6de] text-[#8f433d]',
                tone === 'red' && 'border-[#ff5a54]/20 bg-[#ff5a54]/10 text-[#b63c37]',
                tone === 'teal' && 'border-[#49d7d2]/25 bg-[#49d7d2]/12 text-[#157d7a]',
            )}
        >
            {children}
        </span>
    )
}

export const RR_FACTS = [
    {
        icon: Coffee,
        label: 'Coffee poured',
        value: '214 cups',
        detail: 'Before lunch. Nobody here believes in decaf urgency.',
    },
    {
        icon: PieChart,
        label: 'Pie throughput',
        value: '37 slices',
        detail: 'Cherry remains the operational backbone of the town.',
    },
    {
        icon: Siren,
        label: 'Police presence',
        value: '4 cruisers',
        detail: 'A normal amount, unless you count per booth.',
    },
    {
        icon: Sparkles,
        label: 'Supernatural explanations accepted',
        value: '0',
        detail: 'Absolutely not. We are tracking only terrestrial diner events.',
    },
]

export const TOWN_QUOTES = [
    'A sharply dressed federal visitor says the coffee is excellent and the working assumptions should remain earthly.',
    'The sheriff reports the pie is calm, the lot is busy, and no further comment is needed.',
    'A regular at the counter describes booth loyalty as a sacred civic institution, but only in a normal diner sense.',
    'Management confirms the whipped cream situation is under control and not a signal of anything beyond dessert.',
]

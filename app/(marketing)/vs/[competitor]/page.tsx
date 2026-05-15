import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Check, Minus, Sparkles, X } from 'lucide-react'
import { COMPARISONS, findComparison, getComparisonSlugs } from '@/lib/comparisons'
import { SITE_URL } from '@/lib/site'

interface ComparisonPageProps {
    params: Promise<{ competitor: string }>
}

export function generateStaticParams() {
    return getComparisonSlugs().map((competitor) => ({ competitor }))
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
    const { competitor } = await params
    const c = findComparison(competitor)
    if (!c) return {}

    const url = `/vs/${c.slug}`
    const title = `NoPoint vs ${c.competitor} — 🛝 NoPoint`
    const description = c.verdict

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, type: 'article' },
        twitter: { card: 'summary_large_image', title, description },
    }
}

const REPO_URL = 'https://github.com/drmrduck/nopoint'

function GitHubMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.06 11.06 0 0 1 5.79 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
    )
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
    const { competitor } = await params
    const c = findComparison(competitor)
    if (!c) notFound()

    const otherComparisons = COMPARISONS.filter((x) => x.slug !== c.slug)

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    }

    const pageJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `NoPoint vs ${c.competitor}`,
        url: `${SITE_URL}/vs/${c.slug}`,
        description: c.verdict,
        isPartOf: { '@type': 'WebSite', name: 'NoPoint', url: SITE_URL },
    }

    return (
        <div className="dark min-h-screen bg-zinc-950 text-white" style={{ colorScheme: 'dark' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-5 sm:px-8 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur">
                <Link href="/" className="flex items-baseline gap-2 shrink-0">
                    <span className="text-2xl leading-none" aria-hidden>🛝</span>
                    <span className="font-headline text-xl font-bold tracking-tight">NoPoint</span>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                    <a
                        href={REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub repository"
                        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white transition-colors cursor-pointer select-none"
                    >
                        <GitHubMark className="w-4 h-4" />
                    </a>
                    <Link
                        href="/investors"
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-semibold transition-colors cursor-pointer select-none"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        Browse decks
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-16">
                {/* Hero */}
                <section className="flex flex-col gap-5">
                    <Link
                        href="/vs"
                        className="self-start inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300/80 hover:text-blue-300"
                    >
                        Why NoPoint, not...
                    </Link>
                    <div className="text-[13px] font-semibold text-white/55 tracking-wide">
                        {c.framing}
                    </div>
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                        NoPoint vs {c.competitor}
                    </h1>
                    <p className="text-xl text-white/85 leading-snug max-w-3xl">
                        {c.headline}
                    </p>
                    <p className="text-base text-white/60 leading-relaxed max-w-2xl">
                        {c.verdict}
                    </p>
                </section>

                {/* Pick-this heuristic */}
                <section className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3 p-5 rounded-xl border border-blue-500/30 bg-blue-500/5">
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300">
                            <Sparkles className="w-3.5 h-3.5" />
                            Pick NoPoint if
                        </div>
                        <ul className="flex flex-col gap-2">
                            {c.pickUsIf.map((line) => (
                                <li key={line} className="flex gap-2 text-sm text-white/80 leading-relaxed">
                                    <Check className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                            Pick {c.competitor} if
                        </div>
                        <ul className="flex flex-col gap-2">
                            {c.pickThemIf.map((line) => (
                                <li key={line} className="flex gap-2 text-sm text-white/70 leading-relaxed">
                                    <Minus className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Comparison table */}
                <section className="flex flex-col gap-4">
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
                        Side by side
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.04] border-b border-white/10">
                                    <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-[0.18em] text-white/55 w-1/3">
                                        Feature
                                    </th>
                                    <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-[0.18em] text-blue-300">
                                        NoPoint
                                    </th>
                                    <th className="text-left px-4 py-3 font-bold text-[11px] uppercase tracking-[0.18em] text-white/55">
                                        {c.competitor}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {c.table.map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        className={i < c.table.length - 1 ? 'border-b border-white/5' : ''}
                                    >
                                        <td className="px-4 py-3 align-top font-semibold text-white/80">
                                            {row.feature}
                                        </td>
                                        <td className="px-4 py-3 align-top text-white/90">
                                            {row.nopoint}
                                        </td>
                                        <td className="px-4 py-3 align-top text-white/65">
                                            {row.them}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Strengths */}
                <section className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h3 className="font-headline text-lg font-bold tracking-tight">
                            Where {c.competitor} is the right call
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {c.theirStrengths.map((line) => (
                                <li key={line} className="flex gap-2 text-sm text-white/70 leading-relaxed">
                                    <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3 p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h3 className="font-headline text-lg font-bold tracking-tight">
                            Where NoPoint is the right call
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {c.ourStrengths.map((line) => (
                                <li key={line} className="flex gap-2 text-sm text-white/85 leading-relaxed">
                                    <Check className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* FAQs */}
                <section className="flex flex-col gap-4">
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
                        FAQ
                    </h2>
                    <div className="flex flex-col gap-3">
                        {c.faqs.map((f) => (
                            <details
                                key={f.q}
                                className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                            >
                                <summary className="cursor-pointer text-sm font-bold text-white flex items-center justify-between gap-3">
                                    <span>{f.q}</span>
                                    <X className="w-4 h-4 text-white/40 rotate-45 group-open:rotate-0 transition-transform" />
                                </summary>
                                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                                    {f.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
                    <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
                        Try it in fifteen minutes
                    </h2>
                    <p className="text-base text-white/65 leading-relaxed max-w-2xl">
                        Clone the repo, paste the import prompt into Claude Code, Cursor, or Codex, and drop your existing deck in. You will see your deck rebuilt as React components on your own machine.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/getting-started"
                            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white text-sm font-bold transition-colors shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] cursor-pointer select-none"
                        >
                            <Sparkles className="w-4 h-4" />
                            Get started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/investors"
                            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/85 hover:text-white text-sm font-bold transition-colors cursor-pointer select-none"
                        >
                            <BookOpen className="w-4 h-4" />
                            Browse decks
                        </Link>
                    </div>
                </section>

                {/* Other comparisons */}
                {otherComparisons.length > 0 ? (
                    <section className="flex flex-col gap-4 border-t border-white/5 pt-10">
                        <h2 className="font-headline text-xl font-bold tracking-tight">
                            Other comparisons
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {otherComparisons.map((other) => (
                                <Link
                                    key={other.slug}
                                    href={`/vs/${other.slug}`}
                                    className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-4 transition-colors"
                                >
                                    <div className="text-sm font-bold text-white">
                                        NoPoint vs {other.competitor}
                                    </div>
                                    <p className="text-xs text-white/55 leading-relaxed">
                                        {other.framing}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}
            </main>
        </div>
    )
}

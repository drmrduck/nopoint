import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { COMPARISONS } from '@/lib/comparisons'

export const metadata: Metadata = {
    title: 'Why NoPoint, not... — 🛝 NoPoint',
    description:
        'Honest comparisons between NoPoint and the tools founders almost picked instead. Pick the right one for your situation.',
    alternates: { canonical: '/vs' },
    openGraph: {
        title: 'Why NoPoint, not... — 🛝 NoPoint',
        description:
            'Honest comparisons between NoPoint and the tools founders almost picked instead. Pick the right one for your situation.',
        url: '/vs',
    },
}

const REPO_URL = 'https://github.com/drmrduck/nopoint'

function GitHubMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.18-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.06 11.06 0 0 1 5.79 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
    )
}

export default function VsIndexPage() {
    return (
        <div className="dark min-h-screen bg-zinc-950 text-white" style={{ colorScheme: 'dark' }}>
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

            <main className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16 flex flex-col gap-12">
                <section className="flex flex-col gap-4">
                    <span className="self-start text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300/80">
                        Honest comparisons
                    </span>
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                        Why NoPoint, not...
                    </h1>
                    <p className="text-lg text-white/65 leading-relaxed max-w-2xl">
                        These are the tools founders almost pick instead. Each page names what the other tool is actually better at, then says when NoPoint is the right call.
                    </p>
                </section>

                <section className="grid sm:grid-cols-2 gap-3">
                    {COMPARISONS.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/vs/${c.slug}`}
                            className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] p-5 transition-colors"
                        >
                            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                                {c.framing}
                            </div>
                            <div className="text-base font-bold text-white">
                                NoPoint vs {c.competitor}
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed">
                                {c.headline}
                            </p>
                            <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-white/55 group-hover:text-white transition-colors">
                                Read comparison
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    ))}
                </section>
            </main>
        </div>
    )
}

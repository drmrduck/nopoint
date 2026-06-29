'use client'

import { useState } from 'react'
import { FolderTree, Globe, Sparkles, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { CopyPromptButton } from '@/components/getting-started/copy-prompt-button'

// The public skill on skills.sh. Installs into Claude Code, Cursor, or Codex
// from any directory, then choreographs clone → install → import deck → ship.
const INSTALL_CMD = 'npx skills add drmrduck/nopoint --skill nopoint-bring-your-deck'
const SKILLS_URL = 'https://skills.sh/drmrduck/nopoint'

type Mount = 'subdomain' | 'subpath'

const MOUNTS: Record<
    Mount,
    { label: string; example: string; blurb: string; icon: typeof Globe }
> = {
    subdomain: {
        label: 'Subdomain',
        example: 'pitch.yourdomain.com',
        blurb: 'Standalone deploy — its own Vercel / Railway project, your DNS.',
        icon: Globe,
    },
    subpath: {
        label: 'Subpath',
        example: 'yourdomain.com/pitch',
        blurb: 'Mounts inside your existing app via Next.js basePath.',
        icon: FolderTree,
    },
}

function buildPrompt(mount: Mount): string {
    const deploy =
        mount === 'subdomain'
            ? `Deployment: ship it standalone on its own subdomain — pitch.yourdomain.com — as a separate Vercel/Railway project. Ask me for the domain and wire NEXT_PUBLIC_SITE_URL to it.`
            : `Deployment: mount it inside my existing app at a subpath — yourdomain.com/pitch — using Next.js basePath, so it lives alongside my current site. Ask me where my app lives and which path to use.`

    return `Set up nopoint and import my pitch deck, then ship it. Use the nopoint-bring-your-deck skill.

I'll attach my deck in this chat — PDF, PPTX, Keynote export, or one screenshot per slide. Rebuild it slide-for-slide as React components on the nopoint runtime, then run it locally so I can eyeball each slide.

${deploy}`
}

export function SkillInstall() {
    const [mount, setMount] = useState<Mount>('subdomain')

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="flex flex-col gap-1.5 mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                    One-click setup
                </span>
                <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
                    Install the skill, bring your deck
                </h2>
                <p className="text-white/55 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Drop the{' '}
                    <a
                        href={SKILLS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-300"
                    >
                        nopoint skill
                    </a>{' '}
                    into Claude Code, Cursor, or Codex. It clones the repo, installs
                    deps, rebuilds your existing deck as code, and ships it to your own
                    domain — all from one prompt.
                </p>
            </div>

            {/* Step 1 — install the skill */}
            <div className="flex items-center gap-1.5 mb-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-400/15 text-emerald-300 text-[11px] font-bold">
                    1
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Install the skill
                </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <code className="flex-1 inline-flex items-center gap-2 min-w-0 rounded-lg border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 font-mono text-[13px] text-white/80 overflow-x-auto">
                    <Terminal className="w-3.5 h-3.5 shrink-0 text-emerald-300/70" />
                    <span className="whitespace-nowrap">{INSTALL_CMD}</span>
                </code>
                <CopyPromptButton
                    prompt={INSTALL_CMD}
                    label="Copy"
                    variant="ghost"
                    className="shrink-0 justify-center"
                />
            </div>

            {/* Step 2 — choose how to ship */}
            <div className="flex items-center gap-1.5 mt-6 mb-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-400/15 text-emerald-300 text-[11px] font-bold">
                    2
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Choose where it ships
                </span>
            </div>
            <div
                role="tablist"
                aria-label="Deployment target"
                className="grid grid-cols-2 gap-2"
            >
                {(Object.keys(MOUNTS) as Mount[]).map((key) => {
                    const opt = MOUNTS[key]
                    const Icon = opt.icon
                    const active = mount === key
                    return (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setMount(key)}
                            className={cn(
                                'flex flex-col gap-1 rounded-xl border p-3.5 text-left transition-colors cursor-pointer select-none',
                                active
                                    ? 'border-emerald-400/40 bg-emerald-400/[0.06]'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                            )}
                        >
                            <span className="flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        'w-4 h-4',
                                        active ? 'text-emerald-300' : 'text-white/45'
                                    )}
                                />
                                <span
                                    className={cn(
                                        'text-sm font-bold',
                                        active ? 'text-white' : 'text-white/75'
                                    )}
                                >
                                    {opt.label}
                                </span>
                                <code
                                    className={cn(
                                        'ml-auto font-mono text-[11px]',
                                        active ? 'text-emerald-300/90' : 'text-white/35'
                                    )}
                                >
                                    {opt.example}
                                </code>
                            </span>
                            <span className="text-xs text-white/50 leading-snug">
                                {opt.blurb}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Step 3 — the adaptive prompt */}
            <div className="flex items-center gap-1.5 mt-6 mb-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-400/15 text-emerald-300 text-[11px] font-bold">
                    3
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Paste this prompt
                </span>
            </div>
            <div className="rounded-lg border border-white/10 bg-zinc-900/60 p-4">
                <pre className="font-mono text-[12.5px] leading-relaxed text-white/70 whitespace-pre-wrap">
                    {buildPrompt(mount)}
                </pre>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <CopyPromptButton
                        prompt={buildPrompt(mount)}
                        label="Copy prompt"
                        variant="primary"
                    />
                    <a
                        href={SKILLS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/[0.04] text-white/80 hover:text-white text-sm font-bold transition-colors cursor-pointer select-none"
                    >
                        <Sparkles className="w-4 h-4" />
                        View on skills.sh
                    </a>
                </div>
            </div>
        </div>
    )
}

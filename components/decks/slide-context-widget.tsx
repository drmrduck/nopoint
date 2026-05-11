'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import type { SlideContext } from './types'

interface Props {
    context: SlideContext
    open: boolean
    onToggle: () => void
}

export function SlideContextWidget({ context, open, onToggle }: Props) {
    return (
        <div className="group/widget relative">
            <button
                onClick={onToggle}
                aria-label={`Slide context: ${context.category}`}
                aria-expanded={open}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    open
                        ? 'border border-blue-500/30 bg-blue-500/20 text-blue-300'
                        : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
            >
                <Lightbulb className="h-3.5 w-3.5" />
            </button>

            {/* Hover label — anchored bottom-left of the pill so it never overflows
              * the right edge of the slide canvas. z-50 keeps it above panels. */}
            <span
                role="tooltip"
                className="pointer-events-none absolute top-9 right-0 z-50 hidden whitespace-nowrap rounded-md border border-white/10 bg-zinc-950/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-lg backdrop-blur-sm group-hover/widget:block"
            >
                Context — {context.category} <span className="text-white/35">· C</span>
            </span>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-10 right-0 z-40 w-80 overflow-hidden rounded-xl border border-blue-500/25 bg-zinc-950/98 shadow-2xl"
                    >
                        <div className="border-b border-white/8 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="h-3.5 w-3.5 text-blue-400" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                                    Context Hook
                                </p>
                            </div>
                            <p className="mt-1 text-xs text-white/60">{context.category}</p>
                        </div>

                        <div className="space-y-3 px-4 py-3">
                            {context.principles.length > 0 && (
                                <div>
                                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                        Principles
                                    </p>
                                    <ul className="space-y-1">
                                        {context.principles.map((principle, i) => (
                                            <li key={i} className="flex gap-1.5 text-xs text-white/70">
                                                <span className="shrink-0 text-blue-400/60">·</span>
                                                <span>{principle}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div>
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                    What This Is
                                </p>
                                <p className="text-xs leading-relaxed text-white/70">{context.nailsThis}</p>
                            </div>

                            {context.goals && context.goals.length > 0 && (
                                <div>
                                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                        Goals
                                    </p>
                                    <ul className="space-y-1">
                                        {context.goals.map((goal, i) => (
                                            <li key={i} className="flex gap-1.5 text-xs text-white/70">
                                                <span className="shrink-0 text-blue-400/60">·</span>
                                                <span>{goal}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {context.whatItIsNot && (
                                <div>
                                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                        What This Isn&apos;t
                                    </p>
                                    <p className="text-xs leading-relaxed text-white/70">
                                        {context.whatItIsNot}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                                    Story Thread
                                </p>
                                <p className="text-xs leading-relaxed text-white/70">{context.storyThread}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function useContextWidget() {
    const [open, setOpen] = useState(false)
    return { open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }
}

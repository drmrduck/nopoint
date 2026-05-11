'use client'

import { createElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import type { SlideDefinition } from './types'

interface Props {
    slide: SlideDefinition
    open: boolean
    onToggle: () => void
}

export function SlideControlsWidget({ slide, open, onToggle }: Props) {
    if (!slide.controls) return null
    return (
        <div className="group/widget relative">
            <button
                onClick={onToggle}
                aria-label={`Live controls: ${slide.title}`}
                aria-expanded={open}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    open
                        ? 'border border-blue-400/30 bg-blue-500/20 text-blue-200'
                        : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
            >
                <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>

            {/* Hover label — anchored bottom-left of the pill so it never overflows
              * the right edge of the slide canvas. z-50 keeps it above panels. */}
            <span
                role="tooltip"
                className="pointer-events-none absolute top-9 right-0 z-50 hidden whitespace-nowrap rounded-md border border-white/10 bg-zinc-950/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-lg backdrop-blur-sm group-hover/widget:block"
            >
                Controls — {slide.title}
            </span>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-10 right-0 z-40 w-80 overflow-hidden rounded-xl border border-blue-400/25 bg-zinc-950/98 shadow-2xl"
                    >
                        <div className="border-b border-white/8 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-300" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                                    Live Controls
                                </p>
                            </div>
                            <p className="mt-1 text-xs text-white/55">
                                Tweak this slide&apos;s props in real time.
                            </p>
                        </div>
                        <div className="px-4 py-3">{createElement(slide.controls)}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

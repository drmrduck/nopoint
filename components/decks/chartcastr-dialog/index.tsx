'use client'

/**
 * <ChartcastrDialog /> — LOCAL-ONLY tester for the Chartcastr public API.
 *
 * Renders a small Activity-icon button in the deck-viewer's top-right rail
 * when `isDevMode()`. Click → opens a chained dialog:
 *
 *   1. Validate CHARTCASTR_API_KEY by hitting GET /api/chartcastr/sources
 *      (which proxies GET /v1/sources). Shows account.id + email on success.
 *   2. List the returned sources. Click one to fetch its latest pulse via
 *      GET /api/chartcastr/<sourceId>.
 *   3. Preview the chart image, short summary, and long analysis. A "Copy
 *      JSX" button copies a <ChartcastrSource ... /> snippet to the clipboard.
 *      Default is image-only; toggle for image + summary.
 *
 * Production builds never render this — the parent gate is `isDevMode()`.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { DialogBody } from './dialog-body'

interface Props {
    open: boolean
    onToggle: () => void
    onClose: () => void
}

export function ChartcastrDialog({ open, onToggle, onClose }: Props) {
    return (
        <div className="group/widget relative">
            <button
                onClick={onToggle}
                aria-label="Chartcastr API tester (local only)"
                aria-expanded={open}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    open
                        ? 'border border-yellow-500/40 bg-yellow-500/20 text-yellow-200'
                        : 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-300/80 hover:bg-yellow-500/20 hover:text-yellow-200'
                }`}
            >
                <Activity className="h-3.5 w-3.5" />
            </button>

            <span
                role="tooltip"
                className="pointer-events-none absolute top-9 right-0 z-50 hidden whitespace-nowrap rounded-md border border-yellow-500/30 bg-zinc-950/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-200/90 shadow-lg backdrop-blur-sm group-hover/widget:block"
            >
                Chartcastr API <span className="text-yellow-200/40">· LOCAL</span>
            </span>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-10 right-0 z-40 w-[420px] overflow-hidden rounded-xl border border-yellow-500/30 bg-zinc-950/98 shadow-2xl"
                    >
                        <DialogBody onClose={onClose} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

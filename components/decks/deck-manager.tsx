'use client'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GripVertical, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import type { DeckDefinition, SlideDefinition } from './types'

interface SlideState {
    order: string[]
    enabled: Set<string>
}

interface Props {
    deck: DeckDefinition
    slideState: SlideState
    onSlideStateChange: (s: SlideState) => void
    onNavigate: (idx: number) => void
    open: boolean
    onClose: () => void
}

export function DeckManager({
    deck,
    slideState,
    onSlideStateChange,
    onNavigate,
    open,
    onClose,
}: Props) {
    const slideMap = Object.fromEntries(deck.slides.map((s) => [s.id, s]))
    const dragOver = useRef<string | null>(null)
    const dragItem = useRef<string | null>(null)
    const [dragOverId, setDragOverId] = useState<string | null>(null)

    const orderedSlides = slideState.order
        .filter((id) => slideMap[id])
        .map((id) => slideMap[id] as SlideDefinition)

    const enabledOrdered = slideState.order.filter(
        (id) => slideState.enabled.has(id) && slideMap[id],
    )

    function enabledIndex(slideId: string): number | null {
        const idx = enabledOrdered.indexOf(slideId)
        return idx === -1 ? null : idx + 1
    }

    function handleDragStart(id: string) {
        dragItem.current = id
    }

    function handleDragOver(e: React.DragEvent, id: string) {
        e.preventDefault()
        dragOver.current = id
        setDragOverId(id)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const from = dragItem.current
        const to = dragOver.current
        if (!from || !to || from === to) {
            dragItem.current = null
            dragOver.current = null
            setDragOverId(null)
            return
        }

        const newOrder = [...slideState.order]
        const fromIdx = newOrder.indexOf(from)
        const toIdx = newOrder.indexOf(to)
        newOrder.splice(fromIdx, 1)
        newOrder.splice(toIdx, 0, from)

        onSlideStateChange({ ...slideState, order: newOrder })
        dragItem.current = null
        dragOver.current = null
        setDragOverId(null)
    }

    function toggleEnabled(id: string) {
        const next = new Set(slideState.enabled)
        if (next.has(id)) {
            if (next.size === 1) return
            next.delete(id)
        } else {
            next.add(id)
        }
        onSlideStateChange({ ...slideState, enabled: next })
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                        className="absolute top-0 right-0 h-full w-80 bg-zinc-900/98 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
                            <h2 className="text-sm font-semibold text-white">Slide Manager</h2>
                            <button
                                onClick={onClose}
                                title="Close"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-white/30 px-4 pt-3 pb-1">
                            Drag to reorder · toggle to hide
                        </p>

                        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                            {orderedSlides.map((slide) => {
                                const num = enabledIndex(slide.id)
                                const isEnabled = slideState.enabled.has(slide.id)
                                const isDragTarget = dragOverId === slide.id

                                return (
                                    <div
                                        key={slide.id}
                                        draggable
                                        onDragStart={() => handleDragStart(slide.id)}
                                        onDragOver={(e) => handleDragOver(e, slide.id)}
                                        onDrop={handleDrop}
                                        onDragEnd={() => {
                                            dragItem.current = null
                                            dragOver.current = null
                                            setDragOverId(null)
                                        }}
                                        className={`flex items-center gap-2 px-2 py-2.5 rounded-lg transition-all cursor-grab active:cursor-grabbing active:opacity-40 ${
                                            isDragTarget
                                                ? 'border border-blue-500/50 bg-blue-500/5'
                                                : 'border border-transparent hover:bg-white/5'
                                        }`}
                                    >
                                        <GripVertical className="w-3.5 h-3.5 text-white/20 shrink-0" />

                                        <span className="text-xs text-white/25 w-5 text-right shrink-0">
                                            {num ?? '–'}
                                        </span>

                                        <button
                                            onClick={() => {
                                                if (!isEnabled || num === null) return
                                                onNavigate(num - 1)
                                                onClose()
                                            }}
                                            disabled={!isEnabled}
                                            className="flex-1 text-left text-sm truncate text-white/70 hover:text-white disabled:text-white/25 disabled:cursor-default transition-colors"
                                        >
                                            {slide.title}
                                        </button>

                                        <Switch
                                            checked={isEnabled}
                                            onCheckedChange={() => toggleEnabled(slide.id)}
                                            disabled={isEnabled && slideState.enabled.size === 1}
                                            title={
                                                isEnabled && slideState.enabled.size === 1
                                                    ? 'At least one slide must stay visible'
                                                    : isEnabled
                                                        ? 'Hide slide'
                                                        : 'Show slide'
                                            }
                                            className="shrink-0"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

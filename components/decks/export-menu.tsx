'use client'
import { useState } from 'react'
import { Loader2, ImageIcon, FileText, Presentation, FlaskConical } from 'lucide-react'
import type { DeckDefinition, SlideDefinition } from './types'
import { isLocalEnv } from '../../lib/utils/env'
import posthog from 'posthog-js'

interface Props {
    deck: DeckDefinition
    currentSlideIdx: number
    orderedEnabled: string[]
    slideMap: Record<string, SlideDefinition>
    variantChoices: Record<string, string>
    slideRef: React.RefObject<HTMLDivElement | null>
}

type ExportJob = 'png' | 'pdf' | 'pptx' | null

interface CaptureOptions {
    scale: number
    /** 0–1 JPEG quality. If >= 0.9, the encoder swaps to PNG. */
    quality: number
}

const DEFAULT_OPTS: CaptureOptions = { scale: 2, quality: 0.92 }

function pickFormat(quality: number): 'image/png' | 'image/jpeg' {
    return quality >= 0.9 ? 'image/png' : 'image/jpeg'
}

function resolveComponent(
    slide: SlideDefinition,
    variantKey: string | undefined,
): React.ComponentType {
    if (variantKey && slide.variants?.[variantKey]) {
        return slide.variants[variantKey].component
    }
    if (slide.defaultVariant && slide.variants?.[slide.defaultVariant]) {
        return slide.variants[slide.defaultVariant].component
    }
    return slide.component
}

async function captureSlide(
    SlideComponent: React.ComponentType,
    width: number,
    height: number,
    opts: CaptureOptions,
): Promise<string> {
    const html2canvas = (await import('html2canvas-pro')).default
    const { createRoot } = await import('react-dom/client')
    const React = await import('react')

    const div = document.createElement('div')
    div.style.cssText = `position:fixed;left:-9999px;top:0;width:${width}px;height:${height}px;background:#09090b;overflow:hidden;`
    div.className = 'dark'
    document.body.appendChild(div)

    const root = createRoot(div)
    await new Promise<void>((resolve) => {
        root.render(
            React.default.createElement(
                'div',
                { style: { width, height } },
                React.default.createElement(SlideComponent),
            ),
        )
        setTimeout(resolve, 300)
    })

    const canvas = await html2canvas(div, {
        scale: opts.scale,
        useCORS: true,
        backgroundColor: '#09090b',
    })

    root.unmount()
    document.body.removeChild(div)

    return canvas.toDataURL(pickFormat(opts.quality), opts.quality)
}

function estimateBytesPerSlide(width: number, height: number, opts: CaptureOptions): number {
    const px = width * height * opts.scale * opts.scale
    if (opts.quality >= 0.9) return px * 1.6 // PNG
    return px * (0.05 + opts.quality * 0.35)
}

function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function ExportMenu({
    deck,
    currentSlideIdx,
    orderedEnabled,
    slideMap,
    variantChoices,
    slideRef,
}: Props) {
    const [job, setJob] = useState<ExportJob>(null)
    const [opts, setOpts] = useState<CaptureOptions>(DEFAULT_OPTS)
    const local = typeof window !== 'undefined' ? isLocalEnv() : false

    const baseFilename = (deck.pdfFilename ?? `${deck.id}-deck.pdf`).replace(/\.pdf$/, '')

    async function exportPng() {
        if (job) return
        setJob('png')
        try {
            const html2canvas = (await import('html2canvas-pro')).default
            const el = slideRef.current
            if (!el) return
            const canvas = await html2canvas(el, {
                scale: opts.scale,
                useCORS: true,
                backgroundColor: '#09090b',
            })
            const slideId = orderedEnabled[currentSlideIdx]
            const title = slideMap[slideId]?.title ?? `slide-${currentSlideIdx + 1}`
            const ext = opts.quality >= 0.9 ? 'png' : 'jpg'
            const link = document.createElement('a')
            link.download = `${deck.id}-${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`
            link.href = canvas.toDataURL(pickFormat(opts.quality), opts.quality)
            link.click()
            posthog.capture('deck_exported', { format: 'png', deck_id: deck.id, slide_count: 1 })
        } finally {
            setJob(null)
        }
    }

    async function exportPdf() {
        if (job) return
        setJob('pdf')
        try {
            const { jsPDF } = await import('jspdf')
            const width = window.innerWidth
            const height = window.innerHeight

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [width, height],
                hotfixes: ['px_scaling'],
                compress: true,
            })

            for (let i = 0; i < orderedEnabled.length; i++) {
                if (i > 0) pdf.addPage([width, height], 'landscape')
                const slideId = orderedEnabled[i]
                const slide = slideMap[slideId]
                if (!slide) continue
                const Component = resolveComponent(slide, variantChoices[slideId])
                const dataUrl = await captureSlide(Component, width, height, opts)
                pdf.addImage(
                    dataUrl,
                    opts.quality >= 0.9 ? 'PNG' : 'JPEG',
                    0,
                    0,
                    width,
                    height,
                )
            }

            pdf.save(`${baseFilename}.pdf`)
            posthog.capture('deck_exported', { format: 'pdf', deck_id: deck.id, slide_count: orderedEnabled.length })
        } finally {
            setJob(null)
        }
    }

    async function exportPptx() {
        if (job) return
        setJob('pptx')
        try {
            const pptxgen = (await import('pptxgenjs')).default
            const width = window.innerWidth
            const height = window.innerHeight
            const pres = new pptxgen()
            pres.layout = 'LAYOUT_WIDE'

            for (const slideId of orderedEnabled) {
                const slide = slideMap[slideId]
                if (!slide) continue
                const Component = resolveComponent(slide, variantChoices[slideId])
                const dataUrl = await captureSlide(Component, width, height, opts)
                const pSlide = pres.addSlide()
                pSlide.background = { color: '09090B' }
                pSlide.addImage({ data: dataUrl, x: 0, y: 0, w: 13.333, h: 7.5 })
            }

            await pres.writeFile({ fileName: `${baseFilename}.pptx` })
            posthog.capture('deck_exported', { format: 'pptx', deck_id: deck.id, slide_count: orderedEnabled.length })
        } finally {
            setJob(null)
        }
    }

    const estimatedBytes =
        typeof window !== 'undefined'
            ? estimateBytesPerSlide(window.innerWidth, window.innerHeight, opts) * orderedEnabled.length
            : 0

    return (
        <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                Export
            </p>

            <div className="space-y-2">
                <ExportButton
                    icon={<ImageIcon className="w-4 h-4" />}
                    label="Download slide as image"
                    loadingLabel="Capturing…"
                    isLoading={job === 'png'}
                    disabled={!!job}
                    onClick={exportPng}
                />
                <ExportButton
                    icon={<FileText className="w-4 h-4" />}
                    label="Download deck as PDF"
                    loadingLabel="Generating PDF…"
                    isLoading={job === 'pdf'}
                    disabled={!!job}
                    onClick={exportPdf}
                />
                <ExportButton
                    icon={<Presentation className="w-4 h-4" />}
                    label="Download deck as PPTX"
                    loadingLabel="Generating PPTX…"
                    isLoading={job === 'pptx'}
                    disabled={!!job}
                    onClick={exportPptx}
                />
            </div>

            <p className="text-[10px] text-white/20 mt-4 leading-relaxed">
                PDF and PPTX export all enabled slides in their current order.
                PPTX can be imported directly into Google Slides.
            </p>

            {local && (
                <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-yellow-300/80 uppercase tracking-wider">
                        <FlaskConical className="w-3 h-3" />
                        Local — quality
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
                            <span>Scale</span>
                            <span className="font-mono text-white/70">{opts.scale.toFixed(1)}×</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={4}
                            step={0.5}
                            value={opts.scale}
                            onChange={(e) => setOpts((o) => ({ ...o, scale: Number(e.target.value) }))}
                            className="w-full accent-yellow-400"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
                            <span>Quality</span>
                            <span className="font-mono text-white/70">
                                {opts.quality.toFixed(2)} ({opts.quality >= 0.9 ? 'PNG' : 'JPEG'})
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0.6}
                            max={0.98}
                            step={0.02}
                            value={opts.quality}
                            onChange={(e) => setOpts((o) => ({ ...o, quality: Number(e.target.value) }))}
                            className="w-full accent-yellow-400"
                        />
                    </div>
                    <p className="text-[10px] text-white/40">
                        Estimated full-deck size: ~{formatSize(estimatedBytes)} ({orderedEnabled.length} slides)
                    </p>
                </div>
            )}
        </div>
    )
}

function ExportButton({
    icon,
    label,
    loadingLabel,
    isLoading,
    disabled,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    loadingLabel: string
    isLoading: boolean
    disabled: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left"
        >
            <span className="text-white/40 shrink-0">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
            </span>
            {isLoading ? loadingLabel : label}
        </button>
    )
}

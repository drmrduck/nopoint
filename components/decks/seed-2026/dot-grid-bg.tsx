'use client'

import { useEffect, useRef } from 'react'
import { dotGridStore, useDotGrid } from './title-slide-store'

function hexToRgb(hex: string): [number, number, number] {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
    if (!m) return [255, 255, 255]
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

export function DotGridBg() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
        x: -9999,
        y: -9999,
        active: false,
    })
    // Subscribe to store so canvas redraws on prop change.
    useDotGrid()

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let raf = 0
        let dpr = window.devicePixelRatio || 1
        let width = 0
        let height = 0

        function resize() {
            if (!canvas || !container) return
            // Use unscaled CSS dimensions — the container lives inside a
            // transform: scale(...) parent, so getBoundingClientRect() would
            // return post-scale screen px and shrink the canvas relative to
            // its own coordinate space.
            width = container.clientWidth
            height = container.clientHeight
            dpr = window.devicePixelRatio || 1
            canvas.width = Math.max(1, Math.floor(width * dpr))
            canvas.height = Math.max(1, Math.floor(height * dpr))
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        function onMove(e: PointerEvent) {
            if (!container) return
            const rect = container.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return
            // Map screen px → canvas (unscaled) px by dividing out the parent
            // transform scale derived from the rect-vs-clientWidth ratio.
            const sx = container.clientWidth / rect.width
            const sy = container.clientHeight / rect.height
            mouseRef.current.x = (e.clientX - rect.left) * sx
            mouseRef.current.y = (e.clientY - rect.top) * sy
            mouseRef.current.active = true
        }
        function onLeave() {
            mouseRef.current.active = false
            mouseRef.current.x = -9999
            mouseRef.current.y = -9999
        }

        function draw() {
            if (!ctx) return
            const { spacing, dotRadius, radius, baseOpacity, activeOpacity, repel, color, accent } =
                dotGridStore.get()
            const [br, bg, bb] = hexToRgb(color)
            const [ar, ag, ab] = hexToRgb(accent)
            const r2 = radius * radius
            const mx = mouseRef.current.x
            const my = mouseRef.current.y
            const active = mouseRef.current.active

            ctx.clearRect(0, 0, width, height)

            const cols = Math.ceil(width / spacing) + 2
            const rows = Math.ceil(height / spacing) + 2
            const offX = (width - (cols - 1) * spacing) / 2
            const offY = (height - (rows - 1) * spacing) / 2

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const baseX = offX + i * spacing
                    const baseY = offY + j * spacing
                    let x = baseX
                    let y = baseY
                    let t = 0 // 0 = base, 1 = fully active

                    if (active) {
                        const dx = baseX - mx
                        const dy = baseY - my
                        const d2 = dx * dx + dy * dy
                        if (d2 < r2 && d2 > 0.0001) {
                            const d = Math.sqrt(d2)
                            const falloff = 1 - d / radius
                            t = falloff * falloff
                            const push = repel * t
                            x = baseX + (dx / d) * push
                            y = baseY + (dy / d) * push
                        }
                    }

                    const r = br + (ar - br) * t
                    const g = bg + (ag - bg) * t
                    const b = bb + (ab - bb) * t
                    const a = baseOpacity + (activeOpacity - baseOpacity) * t

                    ctx.beginPath()
                    ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`
                    ctx.fill()
                }
            }
            raf = requestAnimationFrame(draw)
        }

        const ro = new ResizeObserver(resize)
        ro.observe(container)
        resize()
        raf = requestAnimationFrame(draw)

        container.addEventListener('pointermove', onMove)
        container.addEventListener('pointerleave', onLeave)
        window.addEventListener('resize', resize)

        const unsub = dotGridStore.subscribe(() => {
            // Already in raf loop; nothing extra needed here, but kept for explicit
            // re-render hook if we ever switch off the always-on raf.
        })

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            container.removeEventListener('pointermove', onMove)
            container.removeEventListener('pointerleave', onLeave)
            window.removeEventListener('resize', resize)
            unsub()
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
    )
}

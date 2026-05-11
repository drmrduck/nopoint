import { NextResponse } from 'next/server'
import { fetchLatestPulseServer } from '@/lib/chartcastr/client'

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ sourceId: string }> },
) {
    const { sourceId } = await params

    try {
        const pulse = await fetchLatestPulseServer(sourceId)
        return NextResponse.json(pulse, {
            headers: { 'Cache-Control': 'private, max-age=30' },
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'fetch failed'
        console.error('[api/chartcastr]', sourceId, message)
        return NextResponse.json({ error: message }, { status: 502 })
    }
}

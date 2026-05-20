import { Loader2 } from 'lucide-react'

export function VerifyPane({
    verifying,
    error,
    onRetry,
}: {
    verifying: boolean
    error: string | null
    onRetry: () => void
}) {
    if (verifying) {
        return (
            <div className="flex items-center gap-2 py-6 text-xs text-white/60">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Calling GET /v1/sources …</span>
            </div>
        )
    }
    if (error) {
        return (
            <div className="space-y-3 py-2">
                <p className="text-xs font-semibold text-red-300">Key check failed</p>
                <pre className="overflow-x-auto rounded bg-red-500/10 px-2.5 py-2 text-[11px] text-red-200/90">
                    {error}
                </pre>
                <p className="text-[11px] text-white/50">
                    Check <code className="rounded bg-white/5 px-1">CHARTCASTR_API_KEY</code> in
                    <code className="rounded bg-white/5 px-1">.env.local</code>, then retry.
                </p>
                <button
                    onClick={onRetry}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                    Retry
                </button>
            </div>
        )
    }
    return null
}

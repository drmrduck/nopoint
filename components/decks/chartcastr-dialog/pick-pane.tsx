import type { ChartcastrSourceListEntry } from '@/lib/chartcastr/client'

export function PickPane({
    sources,
    onPick,
    onRetry,
}: {
    sources: ChartcastrSourceListEntry[]
    onPick: (s: ChartcastrSourceListEntry) => void
    onRetry: () => void
}) {
    if (sources.length === 0) {
        return (
            <div className="space-y-3 py-2">
                <p className="text-xs text-white/60">
                    Key works, but the account has no sources. Create one in the
                    Chartcastr admin, then refresh.
                </p>
                <button
                    onClick={onRetry}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                    Refresh
                </button>
            </div>
        )
    }
    return (
        <div className="space-y-1.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Sources ({sources.length})
            </p>
            {sources.map((s) => (
                <button
                    key={s.id}
                    onClick={() => onPick(s)}
                    className="group flex w-full items-center justify-between gap-3 rounded-md border border-white/8 bg-white/2 px-3 py-2 text-left transition hover:border-yellow-500/30 hover:bg-yellow-500/5"
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white/90">
                            {s.name || <span className="text-white/40">(unnamed)</span>}
                        </p>
                        <p className="truncate text-[10px] text-white/40">
                            <span className="font-mono">{s.id}</span> · {s.provider} ·{' '}
                            <StatusDot status={s.status} /> {s.status}
                            {s.connectionCount ? ` · ${s.connectionCount} conn` : ''}
                        </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-yellow-300/0 group-hover:text-yellow-300/90">
                        Load →
                    </span>
                </button>
            ))}
        </div>
    )
}

function StatusDot({ status }: { status: string }) {
    const color =
        status === 'ACTIVE'
            ? 'bg-emerald-400'
            : status === 'DEGRADED'
              ? 'bg-amber-400'
              : status === 'BROKEN'
                ? 'bg-red-400'
                : 'bg-white/30'
    return <span className={`mr-0.5 inline-block h-1.5 w-1.5 rounded-full ${color}`} />
}

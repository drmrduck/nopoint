import { Activity, RefreshCw, X } from 'lucide-react'
import type { ChartcastrAccount } from '@/lib/chartcastr/client'
import type { Step } from './types'

export function Header({
    step,
    account,
    onBack,
    onRetry,
    verifying,
    onClose,
}: {
    step: Step
    account: ChartcastrAccount | null
    onBack?: () => void
    onRetry?: () => void
    verifying: boolean
    onClose: () => void
}) {
    return (
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-yellow-300" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-yellow-200/70">
                    Chartcastr · LOCAL
                </p>
                <StepBadge step={step} />
            </div>
            <div className="flex items-center gap-1.5">
                {account && (
                    <span
                        className="hidden truncate text-[10px] text-white/40 sm:inline"
                        title={`${account.email} · ${account.id}`}
                    >
                        {account.email}
                    </span>
                )}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="rounded px-2 py-1 text-[10px] font-medium text-white/60 hover:bg-white/10 hover:text-white"
                    >
                        ← Back
                    </button>
                )}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        disabled={verifying}
                        title="Re-verify key"
                        className="flex h-6 w-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3 w-3 ${verifying ? 'animate-spin' : ''}`} />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="flex h-6 w-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white"
                >
                    <X className="h-3 w-3" />
                </button>
            </div>
        </div>
    )
}

function StepBadge({ step }: { step: Step }) {
    const steps: Step[] = ['verify', 'pick', 'preview']
    const idx = steps.indexOf(step)
    return (
        <span className="text-[10px] text-white/30">
            {idx + 1}/3 · {step}
        </span>
    )
}

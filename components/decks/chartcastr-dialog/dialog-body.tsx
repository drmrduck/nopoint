import { useCallback, useEffect, useState } from 'react'
import type {
    ChartcastrAccount,
    ChartcastrPulse,
    ChartcastrSourceListEntry,
    ChartcastrSourcesResponse,
} from '@/lib/chartcastr/client'
import type { Step } from './types'
import { Header } from './header'
import { VerifyPane } from './verify-pane'
import { PickPane } from './pick-pane'
import { PreviewPane } from './preview-pane'

export function DialogBody({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState<Step>('verify')
    const [account, setAccount] = useState<ChartcastrAccount | null>(null)
    const [sources, setSources] = useState<ChartcastrSourceListEntry[]>([])
    const [verifyError, setVerifyError] = useState<string | null>(null)
    const [verifying, setVerifying] = useState(false)

    const [selectedSource, setSelectedSource] = useState<ChartcastrSourceListEntry | null>(null)
    const [pulse, setPulse] = useState<ChartcastrPulse | null>(null)
    const [pulseError, setPulseError] = useState<string | null>(null)
    const [pulseLoading, setPulseLoading] = useState(false)

    const verify = useCallback(async () => {
        setVerifying(true)
        setVerifyError(null)
        try {
            const res = await fetch('/api/chartcastr/sources', { cache: 'no-store' })
            const body = await res.json()
            if (!res.ok) throw new Error(body?.error ?? `proxy ${res.status}`)
            const data = body as ChartcastrSourcesResponse
            setAccount(data.account)
            setSources(data.sources)
            setStep('pick')
        } catch (err) {
            setVerifyError(err instanceof Error ? err.message : 'verification failed')
        } finally {
            setVerifying(false)
        }
    }, [])

    // Fetch on mount. The lint rule flags setState-in-effect, but this is
    // the canonical "load data on mount" pattern; verify() owns its own
    // loading and error state and the dialog has nothing to render until it
    // resolves.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void verify()
    }, [verify])

    const loadPulse = useCallback(async (source: ChartcastrSourceListEntry) => {
        setSelectedSource(source)
        setStep('preview')
        setPulse(null)
        setPulseError(null)
        setPulseLoading(true)
        try {
            const res = await fetch(`/api/chartcastr/${encodeURIComponent(source.id)}`, {
                cache: 'no-store',
            })
            const body = await res.json()
            if (!res.ok) throw new Error(body?.error ?? `proxy ${res.status}`)
            setPulse(body as ChartcastrPulse)
        } catch (err) {
            setPulseError(err instanceof Error ? err.message : 'pulse fetch failed')
        } finally {
            setPulseLoading(false)
        }
    }, [])

    return (
        <div>
            <Header
                step={step}
                account={account}
                onBack={
                    step === 'preview'
                        ? () => {
                              setStep('pick')
                              setSelectedSource(null)
                              setPulse(null)
                              setPulseError(null)
                          }
                        : undefined
                }
                onRetry={step === 'verify' || verifyError ? verify : undefined}
                verifying={verifying}
                onClose={onClose}
            />

            <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
                {step === 'verify' && (
                    <VerifyPane verifying={verifying} error={verifyError} onRetry={verify} />
                )}

                {step === 'pick' && (
                    <PickPane sources={sources} onPick={loadPulse} onRetry={verify} />
                )}

                {step === 'preview' && selectedSource && (
                    <PreviewPane
                        source={selectedSource}
                        pulse={pulse}
                        loading={pulseLoading}
                        error={pulseError}
                        onRetry={() => loadPulse(selectedSource)}
                    />
                )}
            </div>
        </div>
    )
}

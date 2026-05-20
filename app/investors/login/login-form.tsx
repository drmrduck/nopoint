'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Lock, ShieldCheck, FlaskConical } from 'lucide-react'
import posthog from 'posthog-js'

export interface DevCred {
    username: string
    password: string
    displayName: string
}

interface Props {
    devCreds: DevCred[] | null
}

function sanitizeNext(target: string | null): string {
    if (!target) return '/investors/portal'
    if (!target.startsWith('/') || target.startsWith('//')) return '/investors/portal'
    return target
}

function LoginFormInner({ devCreds }: Props) {
    const router = useRouter()
    const params = useSearchParams()
    const next = sanitizeNext(params.get('next'))
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch('/api/investors/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error ?? 'Invalid credentials')
                posthog.capture('investor_login_failed', { username })
                return
            }
            posthog.identify(username, { username })
            posthog.capture('investor_logged_in', { username })
            router.push(next)
        } catch {
            setError('Something went wrong. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-blue-500" />
            </div>
            <Link
                href="/"
                aria-label="NoPoint home"
                className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
                <h1 className="font-headline text-xl font-bold text-center mb-1 text-white transition-colors group-hover:text-blue-200">
                    <span aria-hidden className="mr-1.5">🛝</span>
                    NoPoint Investor Portal
                </h1>
                <p className="text-[11px] text-center text-blue-300/70 font-semibold tracking-wider uppercase mb-1 transition-colors group-hover:text-blue-300">
                    All POWER.
                </p>
            </Link>
            <p className="text-sm text-white/50 text-center mb-6">
                Sign in with the credentials you were issued.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    autoComplete="username"
                    placeholder="Username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                    required
                />
                <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                    required
                />
                {error && (
                    <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                    <ShieldCheck className="w-4 h-4" />
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>
            </form>

            {devCreds && devCreds.length > 0 && (
                <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FlaskConical className="w-3.5 h-3.5 text-yellow-400/70" />
                        <span className="text-xs font-semibold text-yellow-400/70 uppercase tracking-wider">
                            Dev — local test credentials
                        </span>
                    </div>
                    <div className="space-y-2">
                        {devCreds.map((cred) => (
                            <button
                                key={cred.username}
                                type="button"
                                onClick={() => {
                                    setUsername(cred.username)
                                    setPassword(cred.password)
                                }}
                                className="w-full text-left rounded-md px-3 py-2 bg-white/3 hover:bg-white/8 transition-colors group"
                            >
                                <p className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">
                                    {cred.displayName}
                                </p>
                                <p className="text-[11px] text-white/30 font-mono mt-0.5">
                                    {cred.username}
                                </p>
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-white/20 mt-3">Click any row to fill the form.</p>
                </div>
            )}
        </div>
    )
}

export function LoginForm(props: Props) {
    return (
        <Suspense fallback={null}>
            <LoginFormInner {...props} />
        </Suspense>
    )
}

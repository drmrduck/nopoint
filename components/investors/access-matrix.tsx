import { INVESTOR_CREDENTIALS } from '@/lib/investors/credentials.server'
import { DECKS } from '@/components/decks'
import { Globe, Lock, Check, Minus, Star, Users } from 'lucide-react'

export function AccessMatrix() {
    const activeCredentials = INVESTOR_CREDENTIALS.filter((c) => !c.disabled)
    const decks = DECKS

    return (
        <section>
            <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
                    Access Matrix
                </h2>
                <span className="text-[10px] text-white/25 ml-1">
                    admin view — visible because you have all-access
                </span>
            </div>
            <p className="text-xs text-white/40 mb-4 max-w-2xl">
                Who can see which deck. Edit{' '}
                <code className="font-mono text-[11px] text-blue-300/80 bg-white/5 px-1 py-0.5 rounded">
                    lib/investors/credentials.server.ts
                </code>{' '}
                to grant access, and{' '}
                <code className="font-mono text-[11px] text-blue-300/80 bg-white/5 px-1 py-0.5 rounded">
                    lib/decks/visibility.ts
                </code>{' '}
                to mark a deck as link-shareable.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/8 bg-white/3">
                                <th className="text-left px-4 py-3 font-semibold text-white/60 text-xs uppercase tracking-wider sticky left-0 bg-zinc-950/80 backdrop-blur-sm">
                                    Deck
                                </th>
                                <th className="px-3 py-3 text-center font-semibold text-emerald-400/80 text-xs uppercase tracking-wider">
                                    <span className="inline-flex items-center gap-1">
                                        <Globe className="w-3 h-3" />
                                        Public
                                    </span>
                                </th>
                                {activeCredentials.map((cred) => (
                                    <th
                                        key={cred.username}
                                        className="px-3 py-3 text-center font-semibold text-white/55 text-[11px]"
                                    >
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="truncate max-w-[12ch]">
                                                {cred.displayName}
                                            </span>
                                            {cred.accessTo === '*' && (
                                                <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-blue-400/80 font-bold">
                                                    <Star className="w-2.5 h-2.5" />
                                                    all-access
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {decks.map((deck, i) => (
                                <tr
                                    key={deck.id}
                                    className={`border-b border-white/5 last:border-b-0 ${
                                        i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                                    }`}
                                >
                                    <td className="px-4 py-3 font-medium text-white sticky left-0 bg-zinc-950/80 backdrop-blur-sm">
                                        <div className="flex items-center gap-2">
                                            {deck.public ? (
                                                <Globe className="w-3 h-3 text-emerald-400/70 shrink-0" />
                                            ) : (
                                                <Lock className="w-3 h-3 text-white/30 shrink-0" />
                                            )}
                                            <span className="truncate">{deck.title}</span>
                                        </div>
                                        <p className="text-[10px] text-white/30 font-mono mt-0.5 ml-5">
                                            {deck.id}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        {deck.public ? (
                                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                                        ) : (
                                            <Minus className="w-3 h-3 text-white/15 mx-auto" />
                                        )}
                                    </td>
                                    {activeCredentials.map((cred) => {
                                        const has =
                                            cred.accessTo === '*' || cred.accessTo.includes(deck.id)
                                        const reason =
                                            cred.accessTo === '*'
                                                ? 'all-access'
                                                : has
                                                ? 'explicit'
                                                : null
                                        return (
                                            <td
                                                key={cred.username}
                                                className="px-3 py-3 text-center"
                                                title={
                                                    reason
                                                        ? `${cred.displayName} → ${deck.title} (${reason})`
                                                        : `${cred.displayName} cannot access ${deck.title}`
                                                }
                                            >
                                                {has ? (
                                                    reason === 'all-access' ? (
                                                        <Star className="w-3.5 h-3.5 text-blue-400/80 mx-auto" />
                                                    ) : (
                                                        <Check className="w-4 h-4 text-blue-400 mx-auto" />
                                                    )
                                                ) : (
                                                    <Minus className="w-3 h-3 text-white/15 mx-auto" />
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-white/8 bg-black/20 px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] text-white/40">
                    <span className="inline-flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-emerald-400/70" />
                        Public link
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-white/30" />
                        Login-gated
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-blue-400" />
                        Granted explicitly
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-blue-400/80" />
                        All-access (<code className="font-mono">accessTo: &apos;*&apos;</code>)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Minus className="w-3 h-3 text-white/15" />
                        No access
                    </span>
                </div>
            </div>
        </section>
    )
}

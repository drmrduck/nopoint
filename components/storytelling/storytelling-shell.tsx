'use client'
import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { ExampleTab } from './tabs/example'

interface TabDef {
    id: string
    label: string
    description: string
    component: React.ComponentType
}

const TABS: TabDef[] = [
    {
        id: 'example',
        label: 'Example',
        description: 'Demonstration of the storytelling shell pattern.',
        component: ExampleTab,
    },
]

export function StorytellingShell() {
    const [activeId, setActiveId] = useState<string>(() => {
        if (typeof window === 'undefined') return TABS[0]?.id ?? ''
        const param = new URLSearchParams(window.location.search).get('tab')
        if (param && TABS.some((t) => t.id === param)) return param
        return TABS[0]?.id ?? ''
    })

    useEffect(() => {
        if (typeof window === 'undefined' || !activeId) return
        const sp = new URLSearchParams(window.location.search)
        sp.set('tab', activeId)
        window.history.replaceState(null, '', `${window.location.pathname}?${sp.toString()}`)
    }, [activeId])

    const active = TABS.find((t) => t.id === activeId) ?? TABS[0]
    const ActiveComponent = active?.component

    return (
        <div className="dark min-h-screen bg-zinc-950 text-white" style={{ colorScheme: 'dark' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 grid lg:grid-cols-[220px_1fr] gap-8 sm:gap-12">
                <aside className="lg:sticky lg:top-10 lg:self-start space-y-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/80">
                        <BookOpen className="w-3.5 h-3.5" />
                        Storytelling
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                        Long-form narrative artefacts. One chapter per tab. Deep-link via
                        <code className="ml-1 text-white/60">?tab=&lt;id&gt;</code>.
                    </p>
                    <nav className="flex flex-col gap-0.5">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveId(t.id)}
                                className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg text-left transition-colors ${
                                    activeId === t.id
                                        ? 'bg-blue-500/10 border border-blue-500/30 text-white'
                                        : 'text-white/55 hover:text-white hover:bg-white/[0.04] border border-transparent'
                                }`}
                            >
                                <span className="text-sm font-medium">{t.label}</span>
                                <span className="text-[11px] text-white/40 leading-snug">
                                    {t.description}
                                </span>
                            </button>
                        ))}
                    </nav>
                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 mt-6">
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-yellow-300/80">
                            Stub mode
                        </p>
                        <p className="text-[11px] text-white/50 leading-relaxed mt-1">
                            Ships as a single example tab. Add more tabs by editing the
                            <code className="ml-1 text-white/70">TABS</code> array.
                        </p>
                    </div>
                </aside>

                <main className="min-w-0">
                    {active && (
                        <header className="mb-6">
                            <h1 className="text-3xl font-bold tracking-tight">{active.label}</h1>
                            <p className="text-white/45 text-sm mt-1">{active.description}</p>
                        </header>
                    )}
                    {ActiveComponent && <ActiveComponent />}
                </main>
            </div>
        </div>
    )
}

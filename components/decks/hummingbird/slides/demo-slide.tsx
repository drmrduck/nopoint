const CODE_LINES = [
    { code: 'import { hummingbird } from \'hummingbird\'', tone: 'import' as const },
    { code: '', tone: 'blank' as const },
    { code: 'export const billing = hummingbird({', tone: 'call' as const },
    { code: '    stripeKey: process.env.STRIPE_KEY,', tone: 'arg' as const },
    { code: '    plans: [\'pro\', \'team\'],', tone: 'arg' as const },
    { code: '    portal: true,', tone: 'arg' as const },
    { code: '})', tone: 'call' as const },
]

const TONE_CLASS: Record<'import' | 'call' | 'arg' | 'blank', string> = {
    import: 'text-emerald-300',
    call: 'text-white',
    arg: 'text-white/80',
    blank: 'text-white/30',
}

export function DemoSlide() {
    return (
        <div className="flex h-full w-full bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/4 via-transparent to-transparent pointer-events-none" />

            <div className="flex flex-col justify-center px-24 w-full relative z-10">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    Demo
                </p>
                <h2 className="font-headline text-6xl font-semibold text-white tracking-tight leading-tight mb-10">
                    3 lines of config.
                    <br />
                    <span className="text-white/40">Webhooks, portal, dunning: handled.</span>
                </h2>

                <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden max-w-5xl">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                        <span className="size-3 rounded-full bg-red-500/60" />
                        <span className="size-3 rounded-full bg-yellow-500/60" />
                        <span className="size-3 rounded-full bg-emerald-500/60" />
                        <span className="ml-3 text-xs font-mono text-white/40">
                            billing.ts
                        </span>
                    </div>
                    <pre className="px-8 py-7 text-2xl font-mono leading-relaxed">
                        {CODE_LINES.map((line) => (
                            <div key={line.code || 'blank'} className={TONE_CLASS[line.tone]}>
                                {line.code || ' '}
                            </div>
                        ))}
                    </pre>
                </div>
            </div>
        </div>
    )
}

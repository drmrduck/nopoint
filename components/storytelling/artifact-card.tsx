interface Props {
    title: string
    eyebrow?: string
    children: React.ReactNode
}

export function ArtifactCard({ title, eyebrow, children }: Props) {
    return (
        <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 sm:p-8">
            {eyebrow && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/80 mb-2">
                    {eyebrow}
                </p>
            )}
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
            <div className="prose prose-invert prose-sm max-w-none text-white/65 leading-relaxed">
                {children}
            </div>
        </section>
    )
}

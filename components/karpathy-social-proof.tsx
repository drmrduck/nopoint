import { headers } from 'next/headers'

const KARPATHY_URL = 'https://x.com/karpathy/status/2053872850101285137'
const PROD_HOSTS = new Set(['nopoint.drummerduck.com', 'nopoint.app'])

type KarpathySocialProofProps = {
    caption?: string
    className?: string
    compact?: boolean
}

export function KarpathySocialProof({
    caption,
    className = '',
    compact = false,
}: KarpathySocialProofProps) {
    return (
        <a
            href={KARPATHY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block rounded-xl border border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/60 transition-colors overflow-hidden ${className}`}
        >
            <img
                src="/karpathy-slideshows.png"
                alt='Andrej Karpathy tweet: "ask your LLM to structure your response as HTML... present its output as slideshows"'
                width={1190}
                height={474}
                loading="lazy"
                className="w-full h-auto block"
            />
            {caption ? (
                <div
                    className={`px-3 py-2 text-white/55 group-hover:text-white/80 transition-colors ${compact ? 'text-[10px]' : 'text-xs'}`}
                >
                    {caption}
                </div>
            ) : null}
        </a>
    )
}

export async function KarpathySocialProofProdOnly(
    props: KarpathySocialProofProps,
) {
    const h = await headers()
    const host = (h.get('host') ?? '').toLowerCase().split(':')[0]
    if (!PROD_HOSTS.has(host)) return null
    return <KarpathySocialProof {...props} />
}

import { useIsEmbed } from '@/lib/decks/embed-context'
import { DotGridBg } from '../dot-grid-bg'

export function TitleSlide() {
    const isEmbed = useIsEmbed()

    return (
        <div className="relative flex h-full w-full overflow-hidden bg-[#040714]">
            <DotGridBg />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-blue-500/15 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-indigo-700/12 blur-3xl"
            />

            <div className="pointer-events-none relative z-10 flex max-w-5xl flex-col justify-center px-24">
                <h1 className="font-headline mb-6 text-8xl font-bold leading-none tracking-tight text-white">
                    <span aria-hidden className="mr-4 inline-block drop-shadow-[0_8px_24px_rgba(59,130,246,0.45)]">
                        🛝
                    </span>
                    NoPoint
                </h1>
                <p className="mb-12 max-w-3xl text-3xl leading-snug text-white/60">
                    Pitch decks vibe coded
                </p>
                <div className="flex items-center gap-4 text-sm text-white/40">
                    <span>Seed Round · 2026</span>
                    <span className="h-1 w-1 rounded-full bg-white/25" />
                    <span>Michael Carter</span>
                </div>
            </div>

            {isEmbed && (
                <div className="pointer-events-none absolute right-16 top-1/2 z-10 -translate-y-1/2 text-right">
                    <p className="text-5xl font-bold leading-[1.05] tracking-tight text-white">
                        This deck <span className="text-blue-300">is</span>
                        <br />
                        the demo!
                    </p>
                </div>
            )}
        </div>
    )
}

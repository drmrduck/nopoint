import { BufferSlide, BUFFER_PALETTE, BufferWordmark } from './_chrome'

export function CoverSlide() {
    return (
        <BufferSlide showWordmark={false}>
            <div className="absolute inset-0 flex flex-col justify-center items-center px-24 text-center">
                <p
                    className="text-sm font-black uppercase tracking-[0.4em] mb-12"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    Seed Round · October 2013
                </p>

                <div className="mb-10">
                    <BufferWordmark size="lg" />
                </div>

                <h1
                    className="font-black tracking-tight leading-[0.95] mb-8"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 144 }}
                >
                    Buffer
                </h1>

                <p
                    className="text-3xl font-bold max-w-3xl leading-snug mb-14"
                    style={{ color: BUFFER_PALETTE.inkSoft }}
                >
                    A better way to share on social media.
                </p>

                <div
                    className="flex items-center gap-4 text-base font-bold"
                    style={{ color: BUFFER_PALETTE.inkSoft }}
                >
                    <span>bufferapp.com</span>
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: BUFFER_PALETTE.green }}
                    />
                    <span>Joel Gascoigne · Leo Widrich</span>
                </div>
            </div>

            <div
                className="absolute bottom-7 right-12 text-xs font-black uppercase tracking-[0.32em]"
                style={{ color: BUFFER_PALETTE.green }}
            >
                $500K · $4M cap
            </div>
        </BufferSlide>
    )
}

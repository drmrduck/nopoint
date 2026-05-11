import { BufferSlide, BUFFER_PALETTE } from './_chrome'

// Faithful recreation of the "Social, the most important trend" slide from
// the Buffer 2013 deck — heavy black headline on linen, two pull-quotes
// flanking the engagement-chart photo, faint "26" page watermark behind it.

export function SocialTrendSlide() {
    return (
        <BufferSlide>
            {/* Faint giant "26" page watermark — preserves the original deck's
                page-number flourish without adding any actual numbering. */}
            <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{
                    fontSize: '52vmin',
                    fontWeight: 900,
                    color: 'rgba(10, 10, 10, 0.04)',
                    lineHeight: 1,
                    transform: 'translateY(2vmin)',
                }}
            >
                26
            </div>

            <div className="relative z-10 flex h-full flex-col px-16 pt-14 pb-20">
                <h2
                    className="text-center font-black leading-[1.02] tracking-tight"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 96 }}
                >
                    Social, the most
                    <br />
                    important trend
                </h2>

                <div className="mt-10 grid flex-1 grid-cols-2 items-center gap-12">
                    <div className="flex flex-col gap-6 pl-4">
                        <p
                            className="text-3xl font-black leading-[1.25]"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            <span aria-hidden>“</span>the amount a user shares
                            today is{' '}
                            <span style={{ color: BUFFER_PALETTE.green }}>
                                twice
                            </span>{' '}
                            the amount they shared a year ago
                            <span aria-hidden>”</span>
                        </p>
                        <p
                            className="pl-8 text-2xl font-black"
                            style={{ color: BUFFER_PALETTE.ink }}
                        >
                            - Zuckerberg’s Law
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/buffer-zuck-engagement.png"
                            alt="Mark Zuckerberg presenting the Facebook engagement growth chart"
                            className="w-full max-w-[34rem] rounded-md shadow-md"
                            style={{ border: `1px solid ${BUFFER_PALETTE.paperEdge}` }}
                        />
                    </div>
                </div>

                <p
                    className="mt-10 text-center text-2xl font-black leading-snug"
                    style={{ color: BUFFER_PALETTE.ink }}
                >
                    <span aria-hidden>“</span>it won’t be long before Social
                    Media Marketing will surpass SEO<span aria-hidden>”</span>{' '}
                    - Donanza
                </p>
            </div>
        </BufferSlide>
    )
}

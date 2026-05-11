import { BufferSlide, BUFFER_PALETTE, BufferBullets } from './_chrome'

const POINTS = [
    'One-click schedule from any page on the web — Chrome, Firefox, Safari',
    'iOS & Android apps. Mobile is now 25% of new posts queued',
    'Web dashboard for queue management, analytics, multi-account',
    'API used by Feedly, IFTTT, Pocket, AppSumo and 60+ partners',
]

export function ProductSlide() {
    return (
        <BufferSlide>
            <div className="px-20 pt-14">
                <h1
                    className="font-black tracking-tight leading-[1]"
                    style={{ color: BUFFER_PALETTE.ink, fontSize: 110 }}
                >
                    One queue.
                    <br />
                    Every channel.
                </h1>
            </div>

            <div className="mt-14 px-24">
                <BufferBullets
                    items={POINTS.map((p, i) =>
                        i === 0 ? (
                            <>
                                <span style={{ color: BUFFER_PALETTE.green }}>
                                    Browser extension —
                                </span>{' '}
                                {p.replace('One-click schedule from any page on the web — ', '')}
                            </>
                        ) : (
                            p
                        ),
                    )}
                />
            </div>
        </BufferSlide>
    )
}

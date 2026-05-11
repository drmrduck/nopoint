import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const BENEFITS = [
    { label: 'Save money', detail: 'when traveling.' },
    { label: 'Make money', detail: 'when hosting.' },
    { label: 'Share culture', detail: 'with local travelers.' },
]

export function SolutionSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Solution"
                title="A web platform where users can rent out their space to host travelers."
            />
            <div className="mt-16 px-20">
                <p
                    className="text-base font-bold uppercase tracking-[0.28em] mb-8"
                    style={{ color: AIRBNB_PALETTE.inkSoft }}
                >
                    For travelers and hosts to:
                </p>
                <div className="grid grid-cols-3 gap-10">
                    {BENEFITS.map((b) => (
                        <div
                            key={b.label}
                            className="rounded-2xl p-8"
                            style={{
                                background: AIRBNB_PALETTE.rausch10,
                                border: `1px solid ${AIRBNB_PALETTE.rausch30}`,
                            }}
                        >
                            <p
                                className="text-3xl font-bold mb-3"
                                style={{ color: AIRBNB_PALETTE.rausch }}
                            >
                                {b.label}
                            </p>
                            <p
                                className="text-xl"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {b.detail}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </AirbnbSlide>
    )
}

import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const TEAM = [
    {
        initial: 'BC',
        name: 'Brian Chesky',
        role: 'CEO · Co-founder',
        body: 'Designer (RISD). Sets the vision, runs the company, talks to every host.',
    },
    {
        initial: 'JG',
        name: 'Joe Gebbia',
        role: 'CXO · Co-founder',
        body: 'Designer (RISD). Owns the experience: photography, copy, host onboarding.',
    },
    {
        initial: 'NB',
        name: 'Nathan Blecharczyk',
        role: 'CTO · Co-founder',
        body: 'Engineer (Harvard). Built the platform; ships the entire product.',
    },
]

export function TeamSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Team"
                title="Three founders. Two designers and an engineer."
            />
            <div className="mt-14 px-20 grid grid-cols-3 gap-10">
                {TEAM.map((m) => (
                    <div key={m.name} className="flex flex-col gap-5">
                        <div
                            className="flex h-32 w-32 items-center justify-center rounded-full text-3xl font-bold"
                            style={{
                                background: AIRBNB_PALETTE.rausch,
                                color: AIRBNB_PALETTE.paper,
                            }}
                        >
                            {m.initial}
                        </div>
                        <div>
                            <p
                                className="text-2xl font-bold"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {m.name}
                            </p>
                            <p
                                className="text-sm font-bold uppercase tracking-[0.2em] mt-1"
                                style={{ color: AIRBNB_PALETTE.rausch }}
                            >
                                {m.role}
                            </p>
                        </div>
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: AIRBNB_PALETTE.inkSoft }}
                        >
                            {m.body}
                        </p>
                    </div>
                ))}
            </div>
            <p
                className="absolute bottom-10 left-20 right-20 text-xs uppercase tracking-[0.24em] font-bold"
                style={{ color: AIRBNB_PALETTE.inkSoft }}
            >
                We&apos;ve shipped the live product, run two convention launches, and supported every booking ourselves.
            </p>
        </AirbnbSlide>
    )
}

import { AirbnbSlide, AirbnbHeadline, AIRBNB_PALETTE } from './_chrome'

const EVENTS = [
    {
        when: 'Mar 2008',
        name: 'SXSW Austin',
        body: 'Launched the first version. Hotels in Austin sold out months in advance.',
    },
    {
        when: 'Aug 2008',
        name: 'Democratic National Convention · Denver',
        body: '80,000+ attendees. Denver had ~30,000 hotel rooms. We listed 800 air beds.',
    },
    {
        when: 'Sep 2008',
        name: 'Republican National Convention · Minneapolis',
        body: 'Same playbook. Repeat hosts started returning from the DNC list.',
    },
    {
        when: 'Mar 2009',
        name: 'ETech / SXSW round 2',
        body: 'Conference traffic stays the cheapest acquisition channel we have.',
    },
]

export function MarketAdoptionSlide() {
    return (
        <AirbnbSlide>
            <AirbnbHeadline
                eyebrow="Market Adoption"
                title="We grow by chasing events with hotel shortages."
            />
            <div className="mt-14 px-20 grid grid-cols-2 gap-x-12 gap-y-8">
                {EVENTS.map((e) => (
                    <div
                        key={e.name}
                        className="flex gap-5 pl-5"
                        style={{ borderLeft: `2px solid ${AIRBNB_PALETTE.rausch}` }}
                    >
                        <div className="flex-1">
                            <p
                                className="text-[11px] font-bold uppercase tracking-[0.28em]"
                                style={{ color: AIRBNB_PALETTE.rausch }}
                            >
                                {e.when}
                            </p>
                            <p
                                className="text-2xl font-bold mt-2"
                                style={{ color: AIRBNB_PALETTE.ink }}
                            >
                                {e.name}
                            </p>
                            <p
                                className="text-sm mt-2 leading-relaxed"
                                style={{ color: AIRBNB_PALETTE.inkSoft }}
                            >
                                {e.body}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p
                className="absolute bottom-10 left-20 right-20 text-xs uppercase tracking-[0.24em] font-bold"
                style={{ color: AIRBNB_PALETTE.inkSoft }}
            >
                Conferences are repeatable acquisition wedges — every event has the same shortage shape.
            </p>
        </AirbnbSlide>
    )
}

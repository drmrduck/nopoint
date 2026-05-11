import { AirbnbSlide, AIRBNB_PALETTE } from './_chrome'

export function CoverSlide() {
    return (
        <AirbnbSlide>
            <div className="absolute inset-0 flex flex-col justify-center px-24">
                <p
                    className="text-[11px] font-bold uppercase tracking-[0.4em] mb-12"
                    style={{ color: AIRBNB_PALETTE.rausch }}
                >
                    Pitch · 2009
                </p>
                <h1 className="text-[112px] font-bold tracking-tight leading-[0.95] mb-10">
                    AirBed
                    <span style={{ color: AIRBNB_PALETTE.rausch }}>&amp;</span>
                    Breakfast
                </h1>
                <p
                    className="text-3xl font-medium max-w-3xl leading-snug"
                    style={{ color: AIRBNB_PALETTE.inkSoft }}
                >
                    Book rooms with locals, rather than hotels.
                </p>
                <div
                    className="mt-16 flex items-center gap-4 text-sm"
                    style={{ color: AIRBNB_PALETTE.inkSoft }}
                >
                    <span className="font-mono">airbedandbreakfast.com</span>
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: AIRBNB_PALETTE.rausch }}
                    />
                    <span>Brian Chesky · Joe Gebbia · Nathan Blecharczyk</span>
                </div>
            </div>
            <div
                className="absolute bottom-10 right-12 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: AIRBNB_PALETTE.rausch }}
            >
                Seed Round
            </div>
        </AirbnbSlide>
    )
}

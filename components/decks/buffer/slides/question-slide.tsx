import { BUFFER_FONT, BUFFER_PALETTE } from './_chrome'

export function QuestionSlide() {
    return (
        <div
            className="relative h-full w-full overflow-hidden flex items-center justify-center px-24"
            style={{
                background: BUFFER_PALETTE.ink,
                color: BUFFER_PALETTE.paperWhite,
                fontFamily: BUFFER_FONT,
            }}
        >
            <h2
                className="text-center font-black tracking-tight"
                style={{
                    color: BUFFER_PALETTE.paperWhite,
                    fontSize: 96,
                    lineHeight: 1.05,
                    letterSpacing: '-0.015em',
                    maxWidth: 980,
                }}
            >
                How do you use social to drive traffic?
            </h2>
        </div>
    )
}

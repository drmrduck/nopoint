import { Pencil, X } from 'lucide-react'
import { BufferSlide, BUFFER_PALETTE } from './_chrome'

const ROW_BORDER = '#E6E9EC'
const TIME_BG = '#F4F6F8'
const DATE_BG = '#ECEEF0'
const DATE_INK = '#7A8389'
const BODY_INK = '#2F3942'
const ICON_INK = '#9AA3AB'

type QueueRow = { time: string; render: () => React.ReactNode }
type QueueDay = { label: string; rows: QueueRow[] }

function Link({ children }: { children: React.ReactNode }) {
    return <span style={{ color: BUFFER_PALETTE.green }}>{children}</span>
}

const DAYS: QueueDay[] = [
    {
        label: 'Saturday 1st October',
        rows: [
            {
                time: '2:52 PM',
                render: () => (
                    <>
                        10 Great Tweetable Quotes To Cheer You Up{' '}
                        <Link>http://j.mp/nd6rzC</Link>
                    </>
                ),
            },
            {
                time: '8:08 PM',
                render: () => (
                    <>
                        Great list: My Favorite Tools <Link>http://j.mp/omcnEU</Link> by{' '}
                        <Link>@EvanCarmichael</Link>
                    </>
                ),
            },
        ],
    },
    {
        label: 'Sunday 2nd October',
        rows: [
            {
                time: '2:52 PM',
                render: () => (
                    <>
                        No man is useless while he has a friend. - Robert Louis{' '}
                        <Link>http://j.mp/nd6rzC</Link> great find from <Link>@sandmaxprime</Link>
                    </>
                ),
            },
            {
                time: '8:08 PM',
                render: () => (
                    <>
                        We make a living by what we get, but we make a life by what we give.
                        ~ Churchill <Link>http://j.mp/nd6rzC</Link> featuring{' '}
                        <Link>@amitv_tweets</Link>
                    </>
                ),
            },
        ],
    },
    {
        label: 'Monday 3rd October',
        rows: [
            {
                time: '1:04 AM',
                render: () => (
                    <>
                        Don&rsquo;t deny your feelings. They alone are what guide you through
                        life. ~Anon <Link>http://j.mp/nd6rzC</Link> featuring <Link>@LXLee</Link>
                    </>
                ),
            },
        ],
    },
]

export function QueueSlide() {
    return (
        <BufferSlide>
            <div className="relative h-full w-full flex flex-col px-16 pt-8 pb-12 overflow-hidden">
                <h2
                    className="text-center font-black tracking-tight shrink-0"
                    style={{
                        color: BUFFER_PALETTE.ink,
                        fontSize: 88,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Queue your updates
                </h2>

                <div
                    className="mt-6 mx-auto w-full max-w-[1400px] rounded-md overflow-hidden flex-1 min-h-0 flex flex-col"
                    style={{
                        background: BUFFER_PALETTE.paperWhite,
                        border: `1px solid ${ROW_BORDER}`,
                        boxShadow: '0 2px 0 rgba(0,0,0,0.03)',
                    }}
                >
                    {DAYS.map((day, dayIdx) => (
                        <div key={day.label} className="flex flex-col">
                            <div
                                className="px-6 py-2 shrink-0"
                                style={{
                                    background: DATE_BG,
                                    color: DATE_INK,
                                    borderTop:
                                        dayIdx === 0 ? 'none' : `1px solid ${ROW_BORDER}`,
                                    borderBottom: `1px solid ${ROW_BORDER}`,
                                    fontSize: 17,
                                    fontWeight: 400,
                                }}
                            >
                                {day.label}
                            </div>

                            {day.rows.map((row, rowIdx) => (
                                <div
                                    key={rowIdx}
                                    className="flex items-stretch shrink-0"
                                    style={{
                                        borderBottom:
                                            rowIdx === day.rows.length - 1
                                                ? 'none'
                                                : `1px solid ${ROW_BORDER}`,
                                    }}
                                >
                                    <div
                                        className="flex items-center justify-center shrink-0"
                                        style={{
                                            width: 110,
                                            background: TIME_BG,
                                            color: BODY_INK,
                                            borderRight: `1px solid ${ROW_BORDER}`,
                                            fontSize: 16,
                                            fontWeight: 400,
                                        }}
                                    >
                                        {row.time}
                                    </div>

                                    <div
                                        className="flex-1 min-w-0 px-6 py-3 leading-snug"
                                        style={{
                                            color: BODY_INK,
                                            fontSize: 18,
                                            fontWeight: 400,
                                        }}
                                    >
                                        {row.render()}
                                    </div>

                                    <div
                                        className="flex items-center gap-4 px-5 shrink-0"
                                        style={{ color: ICON_INK }}
                                    >
                                        <Pencil size={18} strokeWidth={1.6} />
                                        <X size={20} strokeWidth={1.6} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </BufferSlide>
    )
}

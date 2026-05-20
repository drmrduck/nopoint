import Link from 'next/link'

export function TopNavLink({
    href,
    title,
    children,
}: {
    href: string
    title: string
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            title={title}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
            {children}
        </Link>
    )
}

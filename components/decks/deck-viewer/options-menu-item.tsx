export function OptionsMenuItem({
    icon,
    label,
    shortcut,
    onClick,
}: {
    icon: React.ReactNode
    label: string
    shortcut?: string
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
            <span className="text-white/40">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            {shortcut && (
                <kbd className="text-xs text-white/20 font-mono">{shortcut}</kbd>
            )}
        </button>
    )
}

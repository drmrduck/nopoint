import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export function RailButton({
    icon,
    title,
    active,
    onClick,
}: {
    icon: React.ReactNode
    title: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            data-rail-button
            title={title}
            onClick={onClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors z-30 relative ${
                active
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-black/40 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
        >
            {icon}
        </button>
    )
}

export function RailPanel({
    children,
    onClose,
}: {
    children: React.ReactNode
    onClose: () => void
}) {
    return (
        <motion.div
            data-rail-panel
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-14 top-1/2 -translate-y-1/2 w-72 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl p-4 z-30"
        >
            <button
                onClick={onClose}
                title="Close"
                className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            {children}
        </motion.div>
    )
}

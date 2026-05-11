'use client'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    return (
        <button
            onClick={async () => {
                await fetch('/api/investors/logout', { method: 'POST' })
                window.location.href = '/investors/login'
            }}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Sign out
        </button>
    )
}

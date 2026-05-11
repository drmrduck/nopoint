export function isLocalEnv(): boolean {
    if (typeof window === 'undefined') return process.env.NODE_ENV !== 'production'
    const host = window.location.hostname
    return (
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.local') ||
        host.startsWith('192.168.')
    )
}

export function isDevMode(): boolean {
    return process.env.NODE_ENV !== 'production'
}

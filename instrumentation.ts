export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { INVESTOR_CREDENTIALS } = await import('@/lib/investors/credentials.server')
        const names = INVESTOR_CREDENTIALS.filter((c) => !c.disabled).map((c) => c.displayName)
        console.log(`[investors] ${names.length} credential(s) loaded: ${names.join(', ')}`)
    }
}

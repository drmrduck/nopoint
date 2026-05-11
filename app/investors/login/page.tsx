import { INVESTOR_CREDENTIALS } from '@/lib/investors/credentials.server'
import { LoginForm, type DevCred } from './login-form'

export default function LoginPage() {
    const devCreds: DevCred[] | null =
        process.env.NODE_ENV === 'development'
            ? INVESTOR_CREDENTIALS.filter((c) => !c.disabled).map((c) => ({
                  username: c.username,
                  password: c.password,
                  displayName: c.displayName,
              }))
            : null

    return (
        <div
            className="flex flex-1 w-full items-center justify-center bg-zinc-950 px-6 py-16"
            style={{ colorScheme: 'dark' }}
        >
            <LoginForm devCreds={devCreds} />
        </div>
    )
}

import type { ReactNode } from 'react'

// Auth is enforced per-page below this layout. The deck library index
// (/investors/decks) and any private deck require an investor session, while
// public deck pages (/investors/decks/<public-id>) bypass the gate. Keeping
// auth out of this layout lets that distinction live with the page that knows
// which deck is being viewed.
export default function DecksLayout({ children }: { children: ReactNode }) {
    return <>{children}</>
}

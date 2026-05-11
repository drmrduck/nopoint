'use client'
import { createContext, useContext, type ReactNode } from 'react'

const EmbedContext = createContext(false)

export function EmbedProvider({ value, children }: { value: boolean; children: ReactNode }) {
    return <EmbedContext.Provider value={value}>{children}</EmbedContext.Provider>
}

/** True when the deck is rendered inside an embed (e.g. homepage demo), false in the full investor viewer. */
export function useIsEmbed() {
    return useContext(EmbedContext)
}

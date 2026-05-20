// Builds an AI-ready install prompt. When deck + slide are known (from the
// URL), the prompt names the exact file paths so an agent can apply the edit
// without guessing. When they're not, it falls back to a generic instruction.
export function buildInstallPrompt({
    sourceId,
    sourceName,
    snippet,
    deckId,
    slideId,
    variantId,
}: {
    sourceId: string
    sourceName: string
    snippet: string
    deckId?: string
    slideId?: string
    variantId?: string
}): string {
    const variantNote =
        variantId && variantId !== 'default'
            ? `\n   (Variant in view: ${variantId} — file likely lives under slides/${slideId}-variants/${variantId}.tsx. Pick the right file based on what's currently rendered.)`
            : ''

    if (deckId && slideId) {
        return `Install a live Chartcastr chart into the "${slideId}" slide of the ${deckId} deck.

Source: "${sourceName}"
Source ID: ${sourceId}

Steps:

1. Edit components/decks/${deckId}/slides/${slideId}-slide.tsx${variantNote}
   - Add this import at the top:
     import { ChartcastrSource } from '@/components/decks/chartcastr-source'
   - Embed the component in a sensible spot in the slide JSX:
     ${snippet}
   - Keep the surrounding copy minimal — let the chart carry the message.

2. Edit components/decks/${deckId}/slides/index.ts
   - Find the registry entry with id: '${slideId}'
   - Add this field so the deck-viewer prefetches the chart on mount:
     chartcastrSourceIds: ['${sourceId}']

3. Update the slide's context.nailsThis (in the same registry entry) to mention that the chart is now load-bearing evidence on this slide.

Then run \`npx tsc --noEmit -p tsconfig.json\` to confirm there are no type errors.`
    }

    return `Install a live Chartcastr chart into one of my deck slides.

Source: "${sourceName}"
Source ID: ${sourceId}
Component snippet: ${snippet}

Steps:

1. Pick the most appropriate slide for this source (Traction, Market, and Product are usually the best fits).

2. Edit components/decks/<deckId>/slides/<slideId>-slide.tsx
   - Add this import at the top:
     import { ChartcastrSource } from '@/components/decks/chartcastr-source'
   - Embed the component in a sensible spot in the slide JSX:
     ${snippet}

3. Edit components/decks/<deckId>/slides/index.ts
   - Find the registry entry for that slide
   - Add this field so the deck-viewer prefetches the chart on mount:
     chartcastrSourceIds: ['${sourceId}']

Tip: open the slide directly (e.g. /investors/decks/<deckId>?slide=<slideId>) and re-copy the prompt — it will then be slide-aware and skip step 1.`
}

import { ArtifactCard } from '../artifact-card'

export function ExampleTab() {
    return (
        <div className="space-y-6">
            <ArtifactCard eyebrow="What this is" title="Storytelling Shell — example tab">
                <p>
                    The Storytelling Shell is for long-form narrative material that
                    doesn&apos;t fit a slide. Each chapter is a tab; each tab is a
                    React component composed of <code>ArtifactCard</code> blocks.
                </p>
                <p>
                    Use it for the parts of an investor narrative that need paragraphs,
                    not headlines: a competitive teardown, an unabridged Problem
                    statement, a Q&amp;A index, an applications-of-the-product
                    catalogue.
                </p>
            </ArtifactCard>

            <ArtifactCard eyebrow="How to extend" title="Add a tab">
                <ol>
                    <li>
                        Create <code>components/storytelling/tabs/&lt;tab-id&gt;.tsx</code>
                        exporting a default-style component (no props).
                    </li>
                    <li>
                        Register it in the <code>TABS</code> array inside{' '}
                        <code>storytelling-shell.tsx</code>.
                    </li>
                    <li>
                        URL <code>?tab=&lt;tab-id&gt;</code> deep-links into it.
                    </li>
                </ol>
            </ArtifactCard>

            <ArtifactCard eyebrow="Why it ships as a stub" title="Scope choice">
                <p>
                    The full chartcastr Storytelling Scratchpad has 10 tabs. Most are
                    investor-deep-dive content, not framework. NoPoint ships the shell
                    plus this one tab so contributors can clone it; the rest is up to
                    the deck author.
                </p>
            </ArtifactCard>
        </div>
    )
}

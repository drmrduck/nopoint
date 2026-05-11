# Contributing to NoPoint

Thanks for picking this up. Short version: open an issue first if it's substantial, keep PRs single-concern, make CI green.

## Dev setup

See the [Quick start](./README.md#quick-start) in the README for `bun install` / `bun dev`. There is no separate dev environment to configure — every env var has a sensible no-op fallback.

## Adding a deck or slide

The complete authoring contract lives in [`AGENTS.md`](./AGENTS.md). Read it before touching `components/decks/`. Highlights:

- Every slide's `context` field is the source of truth for "why is this slide here." Keep it honest.
- Variants live in a `<slide-id>-variants/` subfolder.
- Per-slide LOCAL controls only render outside of production builds — fine for authoring widgets, never for deck content.
- Don't import `SlideDefinition` from a deck folder — always from `components/decks/types`.

## Reporting bugs and requesting features

Use the GitHub issue templates:

- **Bug** — needs repro steps, expected/actual, environment.
- **Feature request** — needs a problem statement, not just a solution.

If something is genuinely security-sensitive, follow [`SECURITY.md`](./SECURITY.md) instead of opening a public issue.

## Pull requests

- One concern per PR. "Fix bug + refactor + add feature" gets bounced.
- Fill in the PR template — three short sections, takes 60 seconds.
- CI must pass before review (typecheck + lint + build).
- Commits don't follow a strict format. Short imperative subject is enough; a paragraph in the body if it's non-obvious.
- Don't bump the version or write release notes — that happens at release time.

## Working with your own AI agent

If you're using Claude Code, Cursor, or another agent to author code: the agent should read `AGENTS.md` first. The slide context contract there is what keeps the deck library coherent across many small changes.

## License of contributions

NoPoint ships under [FSL-1.1-ALv2](./LICENSE.md). By submitting a contribution you agree that:

- Your contribution is offered under the same FSL-1.1-ALv2 terms.
- You grant the maintainer (Drummerduck Pty Ltd) the right to relicense the contribution as needed — including under more permissive terms — without further notice or compensation.

This is in lieu of a separate CLA bot. If your employer's IP policy needs a more formal arrangement, email security@drummerduck.com and we'll work it out.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). Be respectful, assume good faith, and report concerns to security@drummerduck.com.

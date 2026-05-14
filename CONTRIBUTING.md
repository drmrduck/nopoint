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

## Releasing and versioning

NoPoint follows [Semantic Versioning](https://semver.org/) for the public surface: the deck-authoring contract in `AGENTS.md` (`SlideDefinition`, `context`, `controls`, `variants`), the env-var contract in the README, and the route table under `app/`.

Bump rules:

- **PATCH** (`0.1.0 → 0.1.1`) — bug fixes, dependency updates, doc-only changes, internal refactors with no contract change.
- **MINOR** (`0.1.0 → 0.2.0`) — backwards-compatible additions: new optional `SlideDefinition` fields, new env vars with safe defaults, new templates, new view modes, new export formats.
- **MAJOR** (`0.x → 1.0`, `1.x → 2.0`) — breaking changes to the slide contract, removed env vars, renamed routes, or anything that forces a downstream fork to edit code on upgrade.

Pre-1.0, MINOR bumps may carry small breaking changes — they will be called out in the release notes under a **Breaking** heading. Once we tag `v1.0.0`, breaking changes are MAJOR-only.

### Cutting a release

Only maintainers do this — contributors don't need to bump versions in their PRs.

1. Land everything for the release on `main` via PR. CI must be green.
2. Bump `version` in `package.json` to the new value. Commit on `main`: `chore: release v<x.y.z>`.
3. Tag the commit with an annotated tag matching the version:

   ```bash
   git tag -a v<x.y.z> -m "v<x.y.z>" <commit-sha>
   git push origin v<x.y.z>
   ```

4. Draft a GitHub Release from the tag. Group notes under **Added**, **Changed**, **Fixed**, **Security**, and a **Breaking** heading if anything broke. Credit reporters from `SECURITY.md` here if they asked to be named.

Tags are immutable — once `v0.2.0` is pushed, it doesn't move. A bad release gets a new tag (`v0.2.1`), never a re-tag.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). Be respectful, assume good faith, and report concerns to security@drummerduck.com.

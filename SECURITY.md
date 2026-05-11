# Security policy

NoPoint is a self-hostable runtime that gates pitch decks behind a credential. If you find a vulnerability, we want to fix it.

## Reporting a vulnerability

Email **security@drummerduck.com** with:

- a description of the issue,
- steps to reproduce (or a proof-of-concept),
- the version / commit you tested against.

We aim to acknowledge reports within **5 business days** and to ship a fix or workaround for confirmed issues within **30 days**, faster for anything that risks credential or session compromise. Please don't open a public GitHub issue for security reports.

If you'd rather use GitHub's private vulnerability reporting, use the **Security → Report a vulnerability** flow on the repo. It maps to the same inbox.

## What we treat as in-scope

- Auth bypass on `/investors/*` routes or the comment API.
- Session forgery, cookie tampering, or HMAC weaknesses in `lib/investors/session.server.ts`.
- Server-side request forgery, command injection, or arbitrary file read in any route handler.
- XSS or CSRF in the deck viewer or login flow.
- Disclosure of `INVESTOR_SESSION_SECRET` or other env vars to the client.

## Out of scope

- Findings that require physical access to the server.
- Reports about the demo credentials shipped in `lib/investors/credentials.server.ts` — these are intentionally public so people can run the repo.
- Missing security headers that ship correctly under a typical Vercel / Railway / Nginx deployment.
- Any issue that requires modifying the source code first.

## How NoPoint handles auth and data — what self-hosters should know

This section is descriptive, not normative. Read it before deploying so you know what's in your security model.

### Authentication

- **Credentials are hardcoded** in `lib/investors/credentials.server.ts`. There is no database, no signup, no password reset. You edit the file and redeploy. Deliberate — fewer moving parts, no PII to lose.
- **Sessions are HMAC-signed cookies**, signed with `INVESTOR_SESSION_SECRET` (`lib/investors/session.server.ts`). Verification uses `crypto.timingSafeEqual`. Sessions expire after 1 hour.
- **`INVESTOR_SESSION_SECRET` is mandatory in production** — the app throws on startup if missing. Use a long random string (32+ bytes). Rotating it invalidates all live sessions, which is fine.
- The session cookie is `HttpOnly`, `Secure` in production, and `SameSite=Lax`. There is no refresh — sessions roll on the next login.

### What gets sent off the box

NoPoint makes outbound requests in exactly two situations, both opt-in:

- **Slack webhook** (`INVESTOR_COMMENTS_SLACK_WEBHOOK`) — when an investor leaves an in-deck comment, the deck id, slide number, slide title, the commenter's display name + username, and the comment body are POSTed to the webhook URL you configure. If the env var isn't set, comments are logged to stdout instead.
- **PostHog analytics** (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`) — when the public key is set, the client loads `posthog-js` and sends pageview / interaction events. Unset by default.

That's the whole egress story. No third-party auth, no telemetry to us, no error reporting service.

### Self-host hardening checklist

Before pointing a real investor at a deployment:

- [ ] Set `INVESTOR_SESSION_SECRET` to a fresh 32+ byte random string in your hosting provider.
- [ ] Replace the demo entries in `lib/investors/credentials.server.ts` with your own (strong passwords, one row per investor).
- [ ] If you fork into a private repo with real credentials, double-check `.gitignore` and confirm the file isn't accidentally pushed to a public mirror.
- [ ] Decide whether you want comments forwarded — if yes, set `INVESTOR_COMMENTS_SLACK_WEBHOOK` to a Slack incoming webhook on a private channel.
- [ ] Decide whether you want analytics — if no, leave the PostHog vars unset.
- [ ] Serve over HTTPS. Cookie `Secure` flag flips on automatically in production but only matters if the connection is TLS.
- [ ] Keep dependencies current — `bun update` periodically, or wire a Dependabot config.

## Credit

We'll acknowledge reporters in release notes if you'd like to be named. Default is anonymous.

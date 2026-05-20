export const COMMENT_FORWARDING_PROMPT = `I want to wire the in-deck comment system to actually notify me when an investor leaves a comment.

File: app/api/investors/comment/route.ts
Right now the route forwards to a Slack webhook if INVESTOR_COMMENTS_SLACK_WEBHOOK is set, otherwise it just logs to the server console. I want to extend it.

Please ask me, one question at a time:
1. Which channel(s) do you want comments to flow to? Pick any combination of:
   - Slack incoming webhook
   - Discord webhook
   - Email (via Resend, SendGrid, or Postmark — ask which provider)
   - n8n webhook (any custom workflow URL)
   - A custom HTTPS endpoint (POST JSON)
   - Just log to the server console (no notification)
2. For each channel I picked, ask for the URL / API key / from-address / to-address as needed. Confirm the env var names you'll use, e.g. INVESTOR_COMMENTS_SLACK_WEBHOOK, INVESTOR_COMMENTS_DISCORD_WEBHOOK, INVESTOR_COMMENTS_RESEND_API_KEY, INVESTOR_COMMENTS_EMAIL_TO, INVESTOR_COMMENTS_N8N_URL, INVESTOR_COMMENTS_HTTP_URL.
3. Should comments fire-and-forget (don't block the response) or wait for delivery confirmation before responding to the client? (Default: fire-and-forget.)
4. For Slack and Discord, walk me through creating an incoming webhook if I don't already have one (https://api.slack.com/messaging/webhooks for Slack; Server Settings → Integrations → Webhooks for Discord).

Then update app/api/investors/comment/route.ts to POST to all chosen channels in parallel, document each new env var in README.md, and add the keys to .env.local.example if it exists (create one if not).

After my answers, apply the edits and confirm the diff.`

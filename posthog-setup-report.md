# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the DevEvent Next.js App Router project. The following changes were made:

- **`instrumentation-client.ts`** (new) — PostHog client-side initialization using the Next.js 15.3+ instrumentation pattern. Initializes with a reverse proxy (`/ingest`), error tracking (`capture_exceptions`), and debug mode in development.
- **`next.config.ts`** — Added reverse proxy rewrites for `/ingest/*` and `/ingest/static/*` and `/ingest/array/*` so PostHog requests are proxied through the app, improving ad-blocker resilience. Also set `skipTrailingSlashRedirect: true`.
- **`components/ExploreBtn.tsx`** — Added `posthog.capture("explore_events_clicked")` in the button's click handler.
- **`components/EventCard.tsx`** — Converted to a client component and added `posthog.capture("event_card_clicked", { event_title, event_slug, event_location, event_date })` on link click.
- **`components/Navbar.tsx`** — Converted to a client component and added `posthog.capture("nav_create_event_clicked")` on the Create Event link.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` (never committed to source control).

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage hero | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view details (includes title, slug, location, date) | `components/EventCard.tsx` |
| `nav_create_event_clicked` | User clicks the "Create Event" link in the navigation bar | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/451078/dashboard/1658906)
- [Explore Events button clicks](https://us.posthog.com/project/451078/insights/MtEqQT20) — daily trend of homepage CTA engagement
- [Event card clicks over time](https://us.posthog.com/project/451078/insights/oRIP7OEQ) — daily trend of event detail interest
- [Most clicked events by title](https://us.posthog.com/project/451078/insights/3ZaWI14C) — which developer events attract the most clicks
- [Create Event link clicks](https://us.posthog.com/project/451078/insights/gU5R7LuM) — supply-side intent metric
- [Homepage engagement funnel](https://us.posthog.com/project/451078/insights/7snelTLO) — conversion from "Explore Events" click through to an event card click

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

// sentry.client.config.ts
// Browser error monitoring. Does nothing unless NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
	Sentry.init({
		dsn,
		environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
		// Errors are always sent; only a slice of page loads are traced for timing.
		tracesSampleRate: 0.1,
		// Admin screens show customer data, so no cookies, IPs or session replays.
		sendDefaultPii: false,
	});
}

import "dotenv/config";
import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? "development",
    // integrations: [nodeProfilingIntegration()],
    integrations: [],
    // enableLogs: true,
    enableLogs: false,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.5,
    profileSessionSampleRate: 1.0,
    profileLifecycle: "trace",
    sendDefaultPii: false, // False to avoid sending personally identifiable information by default
  });
}

import * as Sentry from "@sentry/node";

export function captureError(e: unknown) {
  if (import.meta.env.VERCEL_ENV !== "development") {
    Sentry.captureException(e);
  }
}

export default captureError;

import * as Sentry from "@sentry/node";

export function captureError(e: unknown) {
  Sentry.captureException(e);
}

export default captureError;

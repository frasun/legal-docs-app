import { API_URL } from "@api/helpers/url";

export const responseHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": API_URL,
  "Content-Security-Policy": "default-src 'self'",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=86400; includeSubDomains",
  "X-XSS-Protection": "1",
};

export function getStatus(e: Error) {
  const status =
    e.cause &&
    Number(e.cause) &&
    Number(e.cause) > 200 &&
    Number(e.cause) < 599;

  return status ? Number(e.cause) : 500;
}

export function parseError(error: unknown) {
  return {
    status: error instanceof Error ? getStatus(error) : 500,
    message: error instanceof Error ? error.message || null : null,
  };
}

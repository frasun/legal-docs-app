import { defineMiddleware } from "astro/middleware";
import { nanoid } from "nanoid";

const SESSION_COOKIE = "pr-ssid";
const SESSION_TOKEN_PREFIX = "__Secure-next-auth";
const SESSION_TOKEN_DEV_PREFIX = "next-auth";
export const SESSION_TOKEN = `${
  import.meta.env.MODE === "production"
    ? SESSION_TOKEN_PREFIX
    : SESSION_TOKEN_DEV_PREFIX
}.session-token`;

export const onRequest = defineMiddleware(
  async ({ cookies, request }, next) => {
    if (!request.url.includes("/api")) {
      if (cookies.has(SESSION_TOKEN)) {
        if (cookies.has(SESSION_COOKIE)) {
          cookies.delete(SESSION_COOKIE);
        }
      } else if (!cookies.has(SESSION_COOKIE)) {
        cookies.set(SESSION_COOKIE, nanoid(), {
          httpOnly: true,
          sameSite: "strict",
          secure: import.meta.env.MODE === "production",
          path: "/",
        });
      }
    }

    return next();
  }
);

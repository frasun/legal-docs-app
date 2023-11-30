import { deleteSessionDocument } from "@db/session";
import routes from "@utils/routes";
import { defineMiddleware } from "astro/middleware";
import { UUID } from "mongodb";
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

    if (request.url.includes(routes.DOCUMENTS)) {
      const refererUrl = request.headers.get("referer");
      const urlSegments = request.url.split("/");
      const documentId = urlSegments[urlSegments.length - 2];

      if (!UUID.isValid(documentId)) {
        if (
          !refererUrl ||
          !refererUrl.includes(documentId) ||
          refererUrl.endsWith(documentId)
        ) {
          try {
            await deleteSessionDocument(documentId, request, cookies);
          } catch {}
        }
      }
    }

    return next();
  }
);

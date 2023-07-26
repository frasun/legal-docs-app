import { defineMiddleware } from "astro/middleware";
import { nanoid } from "nanoid";

const SESSION_COOKIE = "__SSID";

export const onRequest = defineMiddleware(
  async ({ cookies, request }, next) => {
    // if (import.meta.env.MODE === "production") {
    //   const url = new URL(request.url);
    //   const baseUrl = url.origin;
    //   return Response.redirect(`${baseUrl}/404`, 302);
    // }

    if (!cookies.has(SESSION_COOKIE)) {
      cookies.set(SESSION_COOKIE, nanoid(), {
        httpOnly: true,
        sameSite: "strict",
        secure: import.meta.env.MODE === "production",
        path: "/",
      });
    }

    return next();
  }
);

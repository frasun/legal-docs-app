import { defineMiddleware } from "astro/middleware";
import { nanoid } from "nanoid";

const SESSION_COOKIE = "__SSID";

export const onRequest = defineMiddleware(async ({ cookies }, next) => {
  if (!cookies.has(SESSION_COOKIE)) {
    cookies.set(SESSION_COOKIE, nanoid(), {
      httpOnly: true,
      sameSite: "strict",
      secure: import.meta.env.MODE === "production",
      path: "/",
    });
  }

  return next();
});

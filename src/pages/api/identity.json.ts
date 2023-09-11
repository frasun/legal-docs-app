import type { APIRoute } from "astro";
import { getUserIdentity } from "@db/identity";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { identityId, userId } = body;
    let identity;

    if (identityId && userId) {
      identity = await getUserIdentity(identityId, userId);
    }

    if (!identity) {
      return new Response(null, {
        status: 404,
        statusText: "Not found",
      });
    }

    return new Response(JSON.stringify(identity), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(null, { status: 400 });
};

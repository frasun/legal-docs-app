import type { APIRoute } from "astro";
import { getUserIdentity } from "@db/identity";
import { getSession } from "auth-astro/server";

export const post: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

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
      });
    }

    return new Response(JSON.stringify(identity), {
      status: 200,
    });
  }

  return new Response(null, { status: 400 });
};

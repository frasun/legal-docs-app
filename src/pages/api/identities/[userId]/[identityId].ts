import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getUserIdentity } from "@db/identity";
import { UUID } from "mongodb";
import { responseHeaders as headers } from "@utils/headers";

export const get: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const { userId, identityId } = params;

  if (!UUID.isValid(userId as string) || !UUID.isValid(identityId as string)) {
    return new Response(null, { status: 400 });
  }

  try {
    const identity = await getUserIdentity(
      identityId as string,
      userId as string
    );

    if (!identity) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(identity), { status: 200, headers });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

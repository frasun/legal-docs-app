import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { deleteUserAccount } from "@db/user";

export const all: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const userId = session.user?.id;

    if (request.method === "DELETE") {
      const deleted = await deleteUserAccount(userId as string);

      if (!deleted) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    }

    throw new Error(undefined, { cause: 400 });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { deleteUserAccount, getUserByEmail } from "@db/user";
import { deleteUserDocuments, getUserStats } from "@db/document";
import { deleteUserIdentities } from "@db/identity";

export const ALL: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const userId = session.user?.id;
    const userEmail = session.user?.email;

    if (request.method === "GET") {
      const user = await getUserByEmail(userEmail as string);

      if (!user) {
        throw new Error(undefined, { cause: 404 });
      }

      const { created } = user;

      const { documents, drafts, identities } = await getUserStats(
        userId as string
      );

      return new Response(
        JSON.stringify({
          email: userEmail,
          created,
          documents,
          drafts,
          identities,
        }),
        { status: 200, headers }
      );
    }

    if (request.method === "DELETE") {
      const deleted = await deleteUserAccount(userId as string);

      if (!deleted) {
        throw new Error(undefined, { cause: 404 });
      }

      await deleteUserDocuments(userId as string);
      await deleteUserIdentities(userId as string);

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

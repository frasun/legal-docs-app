import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getDocumentId } from "@db/document";

export const get: APIRoute = async ({ request, params }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const { documentId } = params;
    const userId = session.user?.id;
    const response = await getDocumentId(
      documentId as string,
      userId as string
    );

    if (!response) {
      throw new Error(undefined, { cause: 404 });
    }

    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);

    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

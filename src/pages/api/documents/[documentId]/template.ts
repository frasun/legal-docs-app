import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { responseHeaders as headers } from "@api/helpers/response";
import { getDocumentId } from "@db/document";

export const get: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { documentId } = params;
  const userId = session.user?.id;

  try {
    const response = await getDocumentId(
      documentId as string,
      userId as string
    );

    if (!response) {
      return new Response(JSON.stringify(null), { status: 404, headers });
    }

    return new Response(JSON.stringify(response), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

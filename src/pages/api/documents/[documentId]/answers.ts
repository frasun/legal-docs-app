import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { responseHeaders as headers } from "@api/helpers/response";
import { getDocumentAnswers } from "@db/document";

export const post: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  if (request.headers.get("Content-Type") === "application/json") {
    const { documentId } = params;
    const userId = session.user?.id;
    const fields = await request.json();

    try {
      const response = await getDocumentAnswers(
        documentId as string,
        userId as string,
        fields
      );

      if (!response) {
        return new Response(JSON.stringify(null), { status: 404, headers });
      }

      return new Response(JSON.stringify(response), { status: 200, headers });
    } catch (e) {
      return new Response(
        JSON.stringify(e instanceof Error ? e.message : null),
        {
          status: 500,
          headers,
        }
      );
    }
  } else {
    return new Response(JSON.stringify(null), {
      status: 400,
      headers,
    });
  }
};

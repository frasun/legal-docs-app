import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { copyDocument } from "@db/document";
import { responseHeaders as headers } from "@api/helpers/response";

export const post: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const { documentId } = params;
  const userId = session.user?.id;

  try {
    const response = await copyDocument(documentId as string, userId as string);

    if (!response) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(null), { status: 200, headers });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, {
      status: 400,
    });
  }
};

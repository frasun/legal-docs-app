import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft, changeDocumentName } from "@db/document";
import { responseHeaders as headers } from "@api/helpers/response";

export const all: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const { documentId } = params;
  const userId = session.user?.id;

  if (request.method === "DELETE") {
    try {
      const response = await deleteDraft(
        documentId as string,
        userId as string
      );

      if (response.deletedCount === 1) {
        return new Response(JSON.stringify(null), { status: 200, headers });
      }

      return new Response(null, { status: 404 });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : null, {
        status: 500,
      });
    }
  }

  if (request.method === "PATCH") {
    try {
      const name = await request.text();

      const response = await changeDocumentName(
        documentId as string,
        userId as string,
        name
      );

      if (response.modifiedCount === 0) {
        return new Response(null, { status: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : null, {
        status: 400,
      });
    }
  }

  return new Response(null, {
    status: 400,
  });
};

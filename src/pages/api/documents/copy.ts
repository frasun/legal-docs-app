import { UNAUTHORIZED } from "@utils/response";
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { copyDocument } from "@db/document";

export const all: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401, statusText: UNAUTHORIZED });
  }

  if (
    request.method === "POST" &&
    request.headers.get("Content-Type") === "application/json"
  ) {
    const { documentId } = await request.json();
    const userId = session.user?.id;

    try {
      await copyDocument(documentId as string, userId as string);

      return new Response(null, {
        status: 200,
      });
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

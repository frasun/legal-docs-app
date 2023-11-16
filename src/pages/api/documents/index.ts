import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { PAGE } from "@utils/urlParams";
import { getUserDocuments } from "@api/helpers/documents";

export const get: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const userId = session.user?.id as string;
  const url = new URL(request.url);
  const pageParam = url.searchParams.get(PAGE);
  const page = pageParam ? Number(pageParam) : 1;

  try {
    const documents = await getUserDocuments(userId, page);

    return new Response(JSON.stringify(documents), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

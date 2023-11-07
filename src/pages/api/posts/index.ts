import type { APIRoute } from "astro";
import { PAGE, LIMIT, DRAFT } from "@utils/urlParams";
import { getPosts } from "@api/helpers/posts";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const session = await getSession(request);

  try {
    const urlParams = new URL(request.url).searchParams;
    const page = urlParams.get(PAGE) ? Number(urlParams.get(PAGE)) : undefined;
    const limit = urlParams.get(LIMIT)
      ? Number(urlParams.get(LIMIT))
      : undefined;
    const showDarft = urlParams.get(DRAFT)
      ? urlParams.get(DRAFT) === "true"
      : session?.user?.role === UserRoles.admin;
    const showMemberContent = Boolean(session);

    const posts = await getPosts(showDarft, showMemberContent, page, limit);

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers,
    });
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

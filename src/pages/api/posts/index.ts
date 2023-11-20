import type { APIRoute } from "astro";
import { PAGE, LIMIT, DRAFT } from "@utils/urlParams";
import { getPosts } from "@api/helpers/posts";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const session = await getSession(request);
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
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
import { getPost } from "@api/helpers/posts";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const session = await getSession(request);
    const showMemberContent = Boolean(session);
    const showDraft = session?.user?.role === UserRoles.admin;
    const post = await getPost(params.slug as string, showDraft);

    if (!post) {
      throw new Error(undefined, { cause: 404 });
    }

    const { memberContent } = post;

    if (memberContent && !showMemberContent) {
      throw new Error(undefined, { cause: 403 });
    }

    return new Response(JSON.stringify(post), {
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

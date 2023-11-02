import type { APIRoute } from "astro";
import { getPost } from "@api/helpers/posts";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const session = await getSession(request);
  const showMemberContent = Boolean(session);
  const showDraft = session?.user?.role === UserRoles.admin;

  try {
    const post = await getPost(params.slug as string, showDraft);

    if (!post) {
      return new Response(null, { status: 404 });
    }

    const { memberContent } = post;

    if (memberContent && !showMemberContent) {
      return new Response(null, {
        status: 403,
      });
    }

    return new Response(JSON.stringify(post), {
      status: 200,
      headers,
    });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

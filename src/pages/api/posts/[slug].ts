import type { APIRoute } from "astro";
import { getPost } from "@api/helpers/posts";
import { DRAFT, MEMBER_CONTENT } from "@utils/urlParams";
import { responseHeaders as headers } from "@utils/headers";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const urlParams = new URL(request.url).searchParams;
  const draft = urlParams.get(DRAFT);
  const showDraft = draft === "true";
  const session = urlParams.get(MEMBER_CONTENT);
  const showMemberContent = session === "true";

  try {
    const post = await getPost(params.slug as string, showDraft);

    if (!post) {
      return new Response(null, { status: 404 });
    }

    const { memberContent } = post;

    if (memberContent && !showMemberContent) {
      return new Response(null, {
        status: 401,
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

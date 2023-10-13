import type { APIRoute } from "astro";
import { PAGE, LIMIT, DRAFT, MEMBER_CONTENT } from "@utils/urlParams";
import { getPosts } from "@api/helpers/posts";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  try {
    const urlParams = new URL(request.url).searchParams;
    const page = urlParams.get(PAGE) ? Number(urlParams.get(PAGE)) : undefined;
    const limit = urlParams.get(LIMIT)
      ? Number(urlParams.get(LIMIT))
      : undefined;
    const draft = urlParams.get(DRAFT);
    const showDarft = draft === "true";
    const memberContent = urlParams.get(MEMBER_CONTENT);
    const showMemberContent = memberContent === "true";

    const posts = await getPosts(showDarft, showMemberContent, limit, page);

    return new Response(JSON.stringify(posts), {
      status: 200,
    });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

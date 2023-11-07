import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getPrice } from "@utils/stripe";
import { getDocumentPosts } from "@api/helpers/posts";
import { getTemplateInfo } from "@api/helpers/templates";
import { responseHeaders as headers } from "@api/helpers/response";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { documentId } = params;
  const session = await getSession(request);
  const showMemberContent = Boolean(session);
  const showDarft = session?.user?.role === UserRoles.admin;

  try {
    const [info, document] = await Promise.all([
      getDocumentPosts(documentId as string, showMemberContent),
      getTemplateInfo(documentId as string),
    ]);

    if (!info || !document) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers,
      });
    }

    const { title, body, draft, memberContent, keywords, description, posts } =
      info;
    const { index, priceId } = document.data;

    if ((draft && !showDarft) || !index) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers,
      });
    }

    if (memberContent && !showMemberContent) {
      return new Response(JSON.stringify(null), {
        status: 403,
        headers,
      });
    }

    return new Response(
      JSON.stringify({
        title,
        keywords,
        description,
        price: await getPrice(priceId),
        firstQuestionUrl: `/dokumenty/${documentId}/${index[0].questions[0].id.slug}`,
        body,
        posts,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

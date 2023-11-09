import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getPrice } from "@utils/stripe";
import { getDocumentInfo } from "@api/helpers/templates";
import { responseHeaders as headers } from "@api/helpers/response";
import { UserRoles } from "@db/user";
import { getEntry } from "astro:content";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { templateId } = params;
  const session = await getSession(request);
  const showMemberContent = Boolean(session);
  const showDraft = session?.user?.role === UserRoles.admin;

  try {
    const [template, info] = await Promise.all([
      getEntry("documents", templateId as string),
      getDocumentInfo(templateId as string, showMemberContent),
    ]);

    if (!info || !template) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers,
      });
    }
    const { index, priceId } = template.data;
    const { title, body, draft, memberContent, keywords, description, posts } =
      info;

    if ((draft && !showDraft) || !index) {
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
        firstQuestionUrl: `/dokumenty/${templateId}/${index[0].questions[0].id.slug}`,
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

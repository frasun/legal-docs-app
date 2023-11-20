import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { getPrice } from "@utils/stripe";
import { getDocumentInfo } from "@api/helpers/templates";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { UserRoles } from "@db/user";
import { getEntry } from "astro:content";

export const get: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const { templateId } = params;
    const session = await getSession(request);
    const showMemberContent = Boolean(session);
    const showDraft = session?.user?.role === UserRoles.admin;
    const [template, info] = await Promise.all([
      getEntry("documents", templateId as string),
      getDocumentInfo(templateId as string, showMemberContent),
    ]);

    if (!info || !template) {
      throw new Error(undefined, { cause: 404 });
    }
    const { index, priceId } = template.data;
    const { title, body, draft, memberContent, keywords, description, posts } =
      info;

    if ((draft && !showDraft) || !index) {
      throw new Error(undefined, { cause: 404 });
    }

    if (memberContent && !showMemberContent) {
      throw new Error(undefined, { cause: 403 });
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
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

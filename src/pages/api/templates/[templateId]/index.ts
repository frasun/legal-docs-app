import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";
import { getTemplate } from "@api/helpers/templates";
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
    const [template, document] = await Promise.all([
      getTemplate(templateId as string),
      getEntry("documents", templateId as string),
    ]);

    if (!template || !document) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers,
      });
    }

    const { title, draft, memberContent } = template;

    if (draft && !showDraft) {
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

    const { index, encryptedFields, dates, dataFields } = document.data;

    if (!index) {
      return new Response(JSON.stringify(null), {
        status: 500,
        headers,
      });
    }

    return new Response(
      JSON.stringify({
        title,
        index: index.map(({ title, questions }) => ({
          title,
          questions: questions.map(
            ({ id: { slug }, title, token, answer, type }) => ({
              title,
              slug,
              token,
              answer: answer ? answer.slug : answer,
              type,
            })
          ),
        })),
        encryptedFields,
        dateFields: dates,
        dataFields,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (e) {
    return new Response(e instanceof Error ? e.message : JSON.stringify(null), {
      status: 500,
      headers,
    });
  }
};

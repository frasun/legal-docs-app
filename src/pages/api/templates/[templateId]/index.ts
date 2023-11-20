import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";
import { getTemplate } from "@api/helpers/templates";
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
    const [template, document] = await Promise.all([
      getTemplate(templateId as string),
      getEntry("documents", templateId as string),
    ]);

    if (!template || !document) {
      throw new Error(undefined, { cause: 404 });
    }

    const { title, draft, memberContent } = template;

    if (draft && !showDraft) {
      throw new Error(undefined, { cause: 404 });
    }

    if (memberContent && !showMemberContent) {
      throw new Error(undefined, { cause: 403 });
    }

    const { index, encryptedFields, dates, dataFields } = document.data;

    if (!index) {
      throw new Error();
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
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

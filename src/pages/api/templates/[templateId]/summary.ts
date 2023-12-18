import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { UUID } from "mongodb";
import { getDocumentSummary, validateAnswers } from "@db/document";
import type { Document as UserDocument } from "@db/document";
import { getSession } from "auth-astro/server";
import { getTemplate } from "@api/templates";
import type { Template } from "@type";
import { getEntry } from "astro:content";
import { getAnswers } from "@db/session";
import CookieUtil from "cookie";
import { SESSION_COOKIE } from "@utils/cookies";

export const GET: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const { templateId } = params as {
      templateId: string;
    };

    const cookie = request.headers.get("cookie");
    const session = await getSession(request);
    const isUserDocument = UUID.isValid(templateId);

    let doc: UserDocument["doc"] = templateId,
      answers: UserDocument["answers"] = {},
      index: Template["index"],
      draft: UserDocument["draft"] = true,
      title: UserDocument["title"] | undefined,
      templateTitle: UserDocument["title"] = "",
      dateFields: Template["dateFields"],
      canGenerate: boolean = false;

    if (isUserDocument) {
      if (!session) {
        throw new Error(undefined, { cause: 403 });
      }

      const userId = session?.user?.id as string;

      ({ doc, answers, draft, title } = await getDocumentSummary(
        templateId,
        userId
      ));

      if (!draft) {
        throw new Error(undefined, { cause: 303 });
      }
    }

    ({
      index,
      title: templateTitle,
      dateFields,
    } = await getTemplate(cookie, doc));

    if (!isUserDocument) {
      // get default answers
      const questionIndex: Template["index"][number]["questions"] = [];

      for (let { questions } of index) {
        questionIndex.push(...questions);
      }

      for (let { slug } of questionIndex) {
        const questionEntry = await getEntry("questions", slug);

        if (!questionEntry) {
          throw new Error(undefined, { cause: 400 });
        }

        const {
          data: { info, question, ...defaultAnswers },
        } = questionEntry;

        answers = { ...defaultAnswers, ...answers };
      }

      // get session answers
      const cookies = CookieUtil.parse(cookie || "");
      const ssid = session ? session.user?.ssid : cookies[SESSION_COOKIE];

      if (ssid) {
        const sessionAnswers = await getAnswers(ssid, templateId);

        answers = { ...answers, ...sessionAnswers };
      }

      // fill in current date
      if (dateFields) {
        for (let field of dateFields) {
          answers[field] = answers[field] || new Date();
        }
      }
    }

    canGenerate = await validateAnswers(doc, answers);

    return new Response(
      JSON.stringify({
        title: title ?? templateTitle,
        answers,
        index,
        canGenerate,
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

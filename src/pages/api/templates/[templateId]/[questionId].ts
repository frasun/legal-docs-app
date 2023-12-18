import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getTemplate } from "@api/templates";
import { getAnswers as getSessionAnswers } from "@db/session";
import type { Answers, Template } from "@type";
import { UUID } from "mongodb";
import { getAnswers, getDocumentTemplate } from "@api/documents";
import { getEntry } from "astro:content";
import { getSession } from "auth-astro/server";
import CookieUtil from "cookie";
import { SESSION_COOKIE } from "@utils/cookies";

export const GET: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const { templateId, questionId } = params as {
      templateId: string;
      questionId: string;
    };

    const cookie = request.headers.get("cookie");

    let answers: Answers = {},
      docId = templateId,
      draft = false,
      title: string | undefined,
      documentTitle: Template["title"] = "",
      index: Template["index"] = [],
      questionIndex: Template["index"][0]["questions"] = [],
      fields: Answers = {},
      info: string | undefined,
      currentQuestionIndex: number = 0,
      nextId: string | null,
      prevId: string | null,
      question: string | null = null,
      qTitle: string | null = null;

    // get question data
    const questionEntry = await getEntry("questions", questionId as string);

    if (!questionEntry) {
      throw new Error();
    }

    ({
      data: { question, info, ...fields },
    } = questionEntry);

    const isUserDocument = UUID.isValid(templateId);
    if (isUserDocument) {
      ({
        doc: docId,
        title,
        draft,
      } = await getDocumentTemplate(cookie, templateId));

      if (!draft) {
        throw new Error(undefined, { cause: 303 });
      }

      answers = await getAnswers(cookie, templateId, Object.keys(fields));
    }

    // merge user and default answers
    answers = { ...fields, ...answers };

    const session = await getSession(request);
    if (!isUserDocument) {
      // get session answers
      const cookies = CookieUtil.parse(cookie || "");
      const ssid = session ? session.user?.ssid : cookies[SESSION_COOKIE];

      if (ssid) {
        const sessionAnswers = await getSessionAnswers(
          ssid,
          templateId,
          Object.keys(answers)
        );

        answers = { ...answers, ...sessionAnswers };
      }
    }

    // get question data
    ({ title: documentTitle, index } = await getTemplate(cookie, docId));

    if (!title) title = documentTitle;

    // get index
    for (let { questions } of index) {
      questionIndex.push(...questions);
    }

    currentQuestionIndex = questionIndex.findIndex(
      ({ slug }) => slug === questionId
    );

    qTitle = questionIndex[currentQuestionIndex].title;

    // get next/prev links
    prevId =
      currentQuestionIndex > 0
        ? questionIndex[currentQuestionIndex - 1].slug
        : null;
    nextId =
      currentQuestionIndex < questionIndex.length - 1
        ? questionIndex[currentQuestionIndex + 1].slug
        : null;

    return new Response(
      JSON.stringify({
        question,
        questionShort: qTitle || undefined,
        info,
        answers,
        nextId,
        prevId,
        currentQuestionIndex,
        documentTitle: title,
        templateId: docId,
        draft,
        index,
        questionIndex: questionIndex.length,
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

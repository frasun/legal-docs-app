import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { getTemplate } from "@api/templates";
import { Answers, Template } from "@type";
import { UUID } from "mongodb";
import { getAnswers, getDocumentTemplate } from "@api/documents";
import { getEntry } from "astro:content";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
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

  try {
    // get question data
    const questionEntry = await getEntry("questions", questionId as string);

    if (!questionEntry) {
      return new Response(JSON.stringify(null), { status: 500, headers });
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
        return new Response(JSON.stringify(null), { status: 303, headers });
      }

      answers = await getAnswers(cookie, templateId, Object.keys(fields));
    }

    // merge user and default answers
    answers = { ...fields, ...answers };

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
        : `podsumowanie`;

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
    return new Response(e instanceof Error ? e.message : null, {
      status: e instanceof Error ? Number(e.cause) : 500,
      headers,
    });
  }
};

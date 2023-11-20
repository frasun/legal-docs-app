import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { UUID } from "mongodb";
import { getDocumentSummary } from "@db/document";
import type { Document as UserDocument } from "@db/document";
import { getSession } from "auth-astro/server";
import { getTemplate } from "@api/templates";
import { Template } from "@type";
import { getEntry } from "astro:content";
import { entityEnum } from "@utils/constants";
import { getAnswers } from "@db/session";
import CookieUtil from "cookie";
import { SESSION_COOKIE } from "@utils/cookies";

export const get: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const { templateId } = params as {
      templateId: string;
    };
    const cookie = request.headers.get("cookie");
    const isUserDocument = UUID.isValid(templateId);

    let doc: UserDocument["doc"] = templateId,
      answers: UserDocument["answers"] = {},
      index: Template["index"],
      draft: UserDocument["draft"],
      title: UserDocument["title"] | undefined,
      templateTitle: UserDocument["title"] = "",
      dateFields: Template["dateFields"],
      dataFields: Template["dataFields"],
      canGenerate: boolean = false;
    const session = await getSession(request);

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
      dataFields,
    } = await getTemplate(cookie, doc));

    if (!isUserDocument) {
      // get default answers
      const questionIndex: Template["index"][0]["questions"] = [];

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

    // add auth state if needed
    if ("_isLoggedIn" in answers) {
      answers["_isLoggedIn"] = Boolean(session);
    }

    // validate required fields
    if (dataFields) {
      const required: Template["dataFields"] = [];

      dataFields.map((field) => {
        const dataType = answers[`${field}Type`];

        switch (dataType) {
          case entityEnum[0]:
            required.push(
              `${field}PersonName`,
              `${field}PersonStreet`,
              `${field}PersonPostalCode`,
              `${field}PersonCity`,
              `${field}PersonPin`
            );
            break;
          case entityEnum[1]:
            required.push(
              `${field}CompanyName`,
              `${field}CompanyStreet`,
              `${field}CompanyPostalCode`,
              `${field}CompanyCity`,
              `${field}CompanyPin`
            );
            break;
        }
      });

      canGenerate = required.every(
        (field) => answers[field] !== undefined && answers[field] !== ""
      );
    }

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

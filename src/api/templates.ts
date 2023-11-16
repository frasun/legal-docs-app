import type {
  Answers,
  Question,
  Template,
  TemplateInfo,
  TemplateShort,
  TemplateSummary,
} from "@type";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";
import { getAnswers } from "@db/session";

export async function getTemplates(
  cookie: string,
  category?: string,
  search?: string
): Promise<TemplateShort[]> {
  const requestUrl = new URL("/api/templates", API_URL);

  if (category) {
    requestUrl.searchParams.append(CATEGORY, category);
  }

  if (search) {
    requestUrl.searchParams.append(SEARCH, search);
  }

  return await apiRequest(requestUrl, { ...headers, cookie });
}

export async function getTemplateInfo(
  cookie: string,
  templateId: string
): Promise<TemplateInfo> {
  const requestUrl = new URL(`/api/templates/${templateId}/info`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function getTemplate(
  cookie: string | null,
  templateId: string
): Promise<Template> {
  if (!cookie) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/templates/${templateId}`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function getQuestion(
  cookie: string,
  templateId: string,
  questionId: string
): Promise<Question> {
  const requestUrl = new URL(
    `/api/templates/${templateId}/${questionId}`,
    API_URL
  );

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function getSessionAnswers(
  templateId: string,
  ssid: string,
  fields: Answers = {}
) {
  let answers: Answers = {};

  const sessionAnswers = await getAnswers(
    ssid,
    templateId,
    Object.keys(fields)
  );

  if (sessionAnswers) {
    for (let [key, value] of Object.entries(sessionAnswers)) {
      if (value !== null) {
        answers[key] = value;
      }
    }
  }

  return answers;
}

export async function getTemplateSummary(
  cookie: string | null,
  templateId: string
): Promise<TemplateSummary> {
  if (!cookie) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/templates/${templateId}/summary`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

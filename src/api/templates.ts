import type { Template, TemplateShort } from "@type";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";

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

export async function getTemplate(
  cookie: string,
  documentId: string
): Promise<Template> {
  const requestUrl = new URL(`/api/templates/${documentId}`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

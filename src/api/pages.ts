import type { Page } from "@type";
import { apiRequest, headers } from "./helpers/request";
import { API_URL } from "@api/helpers/url";

export async function getPage(pageId: string): Promise<Page> {
  const requestUrl = new URL(`/api/pages/${pageId}`, API_URL);

  return await apiRequest(requestUrl, headers);
}

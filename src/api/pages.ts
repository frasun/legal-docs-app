import headers from "@utils/headers";
import type { Page } from "@type";
import { API_URL, apiRequest } from "./helpers/request";

export async function getPage(pageId: string): Promise<Page> {
  const requestUrl = new URL(`/api/pages/${pageId}`, API_URL);

  return await apiRequest(requestUrl, headers);
}

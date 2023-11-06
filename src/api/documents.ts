import type { Document, DocumentShort } from "@type";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";

export async function getDocuments(
  cookie: string,
  category?: string,
  search?: string
): Promise<DocumentShort[]> {
  const requestUrl = new URL("/api/documents", API_URL);

  if (category) {
    requestUrl.searchParams.append(CATEGORY, category);
  }

  if (search) {
    requestUrl.searchParams.append(SEARCH, search);
  }

  return await apiRequest(requestUrl, { ...headers, cookie });
}

export async function getDocument(
  cookie: string,
  documentId: string
): Promise<Document> {
  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function copyDocument(cookie: string, documentId: string) {
  const requestUrl = new URL(`/api/documents/${documentId}/copy`, API_URL);

  return await apiRequest(requestUrl, { cookie }, "POST");
}

export async function shareDocument(
  cookie: string,
  documentId: string,
  data: object
) {
  const requestUrl = new URL(`/api/documents/${documentId}/share`, API_URL);

  return await apiRequest(
    requestUrl,
    { cookie, "Content-Type": "application/json" },
    "POST",
    JSON.stringify(data)
  );
}

export async function deleteDraft(cookie: string, documentId: string) {
  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(requestUrl, { cookie }, "DELETE");
}

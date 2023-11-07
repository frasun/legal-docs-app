import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";
import { UserDocuments } from "@type";
import { PAGE } from "@utils/urlParams";
import trimWhitespace from "@utils/whitespace";

export async function getDocuments(
  cookie: string,
  page?: string
): Promise<UserDocuments> {
  const requestUrl = new URL(`/api/documents`, API_URL);

  if (page) {
    requestUrl.searchParams.append(PAGE, page);
  }

  return await apiRequest(requestUrl, { cookie });
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

export async function changeDocumentName(
  cookie: string,
  documentId: string,
  name: string
) {
  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(requestUrl, { cookie }, "PATCH", trimWhitespace(name));
}

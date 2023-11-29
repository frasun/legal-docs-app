import { apiRequest, headers } from "@api/helpers/request";
import { API_URL } from "@api/helpers/url";
import { Document } from "@db/document";
import { Answers, DocumentInfo, Template, UserDocuments } from "@type";
import { PAGE } from "@utils/urlParams";
import trimWhitespace from "@utils/whitespace";
import { UUID } from "mongodb";

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

export async function copyDocument(documentId?: string) {
  if (!documentId) {
    throw new Error(undefined, { cause: 400 });
  }

  const requestUrl = new URL(`/api/documents/${documentId}/copy`, API_URL);

  return await apiRequest(requestUrl, {}, "POST");
}

export async function shareDocument(documentId: string, data: object) {
  const requestUrl = new URL(`/api/documents/${documentId}/share`, API_URL);

  return await apiRequest(
    requestUrl,
    { "Content-Type": "application/json" },
    "POST",
    JSON.stringify(data)
  );
}

export async function deleteDraft(documentId?: string) {
  if (!documentId) {
    throw new Error(undefined, { cause: 400 });
  }

  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(requestUrl, {}, "DELETE");
}

export async function changeDocumentName(
  cookie: string,
  documentId: string,
  name: string
) {
  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(requestUrl, { cookie }, "PATCH", trimWhitespace(name));
}

export async function getDocumentTemplate(
  cookie: string | null,
  documentId: string
): Promise<Document> {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents/${documentId}/template`, API_URL);

  return apiRequest(requestUrl, { cookie });
}

export async function getAnswers(
  cookie: string | null,
  documentId: string,
  fields?: string[]
): Promise<Answers> {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents/${documentId}/answers`, API_URL);

  return apiRequest(
    requestUrl,
    { cookie, "Content-Type": "application/json" },
    "POST",
    JSON.stringify(fields)
  );
}

export async function postAnswers(
  documentId: string,
  answers: Answers,
  cookie?: string | null
): Promise<number> {
  if (!documentId) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);
  const requestHeaders = { ...headers, "Content-Type": "application/json" };

  if (cookie) {
    Object.assign(requestHeaders, { cookie });
  }

  return apiRequest(requestUrl, requestHeaders, "PUT", JSON.stringify(answers));
}

export async function postDocument(
  documentId?: string,
  draft?: boolean,
  userEmail?: string,
  cookie?: string | null
): Promise<UUID> {
  if (!documentId) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents`, API_URL);

  const requestHeaders = { "Content-Type": "application/json" };

  if (cookie) {
    Object.assign(requestHeaders, { cookie });
  }

  return apiRequest(
    requestUrl,
    requestHeaders,
    "POST",
    JSON.stringify({
      documentId,
      draft,
      userEmail,
    })
  );
}

export async function initDocumentOrder(
  documentId?: string,
  anonymousEmail?: string,
  cookie?: string
): Promise<URL> {
  if (!documentId) {
    throw new Error(undefined, { cause: 400 });
  }

  const requestUrl = new URL(`/api/documents/${documentId}/order`, API_URL);
  const requestHeaders = { "Content-Type": "application/json" };

  if (cookie) {
    Object.assign(requestHeaders, { cookie });
  }

  return apiRequest(
    requestUrl,
    requestHeaders,
    "POST",
    JSON.stringify({
      anonymousEmail,
    })
  );
}

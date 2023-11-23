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
  cookie: string | null,
  documentId: string,
  answers: Answers
) {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, cookie, "Content-Type": "application/json" },
    "PUT",
    JSON.stringify(answers)
  );
}

export async function postDocument(
  cookie: string | null,
  documentId: string,
  draft?: boolean,
  userEmail?: string
): Promise<UUID> {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, cookie, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      documentId,
      draft,
      userEmail,
    })
  );
}

export async function initDocumentOrder(
  cookie: string | null,
  documentId: string,
  anonymousEmail?: string
): Promise<URL> {
  if (!cookie || !cookie.length) {
    throw new Error();
  }

  const requestUrl = new URL(`/api/documents/${documentId}/order`, API_URL);

  return apiRequest(
    requestUrl,
    { ...headers, cookie, "Content-Type": "application/json" },
    "POST",
    JSON.stringify({
      anonymousEmail,
    })
  );
}

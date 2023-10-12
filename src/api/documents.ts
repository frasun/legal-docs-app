import headers from "@utils/headers";
import type { Document, DocumentShort } from "@type";
import { CATEGORY, DRAFT, MEMBER_CONTENT, SEARCH } from "@utils/urlParams";

export async function getDocuments(
  url: string,
  showDraft: boolean,
  showMemberContent: boolean,
  category?: string,
  search?: string
): Promise<DocumentShort[]> {
  const requestUrl = new URL("/api/documents", url);

  if (showDraft) {
    requestUrl.searchParams.append(DRAFT, String(showDraft));
  }

  if (showMemberContent) {
    requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));
  }

  if (category) {
    requestUrl.searchParams.append(CATEGORY, category);
  }

  if (search) {
    requestUrl.searchParams.append(SEARCH, search);
  }

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}

export async function getDocument(
  url: string,
  documentId: string,
  showMemberContent = false,
  showDarft = false
): Promise<Document> {
  const requestUrl = new URL(`/api/documents/${documentId}`, url);

  if (showDarft) {
    requestUrl.searchParams.append(DRAFT, String(showDarft));
  }

  if (showMemberContent) {
    requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));
  }

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}

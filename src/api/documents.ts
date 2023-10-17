import type { Document, DocumentShort } from "@type";
import { CATEGORY, DRAFT, MEMBER_CONTENT, SEARCH } from "@utils/urlParams";
import { API_URL, apiRequest, headers } from "@api/helpers/request";

export async function getDocuments(
  showDraft: boolean,
  showMemberContent: boolean,
  category?: string,
  search?: string
): Promise<DocumentShort[]> {
  const requestUrl = new URL("/api/documents", API_URL);

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

  return await apiRequest(requestUrl, headers);
}

export async function getDocument(
  documentId: string,
  showMemberContent = false,
  showDarft = false
): Promise<Document> {
  const requestUrl = new URL(`/api/documents/${documentId}`, API_URL);

  if (showDarft) {
    requestUrl.searchParams.append(DRAFT, String(showDarft));
  }

  if (showMemberContent) {
    requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));
  }

  return apiRequest(requestUrl, headers);
}

import headers from "@utils/headers";
import { DRAFT, LIMIT, MEMBER_CONTENT, PAGE } from "@utils/urlParams";
import type { BlogPosts, Post } from "@type";
import { API_URL, apiRequest } from "./helpers/request";

export async function getPost(
  slug: string,
  showDraft = false,
  showMemberContent = false
): Promise<Post> {
  const requestUrl = new URL(`/api/posts/${slug}`, API_URL);

  requestUrl.searchParams.append(DRAFT, String(showDraft));
  requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));

  return apiRequest(requestUrl, headers);
}

export async function getPosts(
  limit?: number,
  page?: number,
  showDraft = false,
  showMemberContent = false
): Promise<BlogPosts> {
  const requestUrl = new URL(`/api/posts`, API_URL);

  requestUrl.searchParams.append(DRAFT, String(showDraft));
  requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));

  if (limit) {
    requestUrl.searchParams.append(LIMIT, String(limit));
  }

  if (page) {
    requestUrl.searchParams.append(PAGE, String(page));
  }

  return await apiRequest(requestUrl, headers);
}

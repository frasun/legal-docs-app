import { DRAFT, LIMIT, PAGE } from "@utils/urlParams";
import type { BlogPosts, Post } from "@type";
import { apiRequest, headers } from "./helpers/request";
import { API_URL } from "@api/helpers/url";

export async function getPost(cookie: string, slug: string): Promise<Post> {
  const requestUrl = new URL(`/api/posts/${slug}`, API_URL);

  return apiRequest(requestUrl, { ...headers, cookie });
}

export async function getPosts(
  cookie: string,
  page?: number | string,
  limit?: number,
  includeDraft = true
): Promise<BlogPosts> {
  const requestUrl = new URL(`/api/posts`, API_URL);

  if (limit) {
    requestUrl.searchParams.append(LIMIT, String(limit));
  }

  if (page) {
    requestUrl.searchParams.append(PAGE, String(page));
  }

  if (!includeDraft) {
    requestUrl.searchParams.append(DRAFT, "false");
  }

  return await apiRequest(requestUrl, { ...headers, cookie });
}

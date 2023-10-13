import headers from "@utils/headers";
import { DRAFT, LIMIT, MEMBER_CONTENT, PAGE } from "@utils/urlParams";
import type { BlogPosts, Post } from "@type";

export async function getPost(
  url: string,
  slug: string,
  showDraft = false,
  showMemberContent = false
): Promise<Post> {
  const requestUrl = new URL(`/api/posts/${slug}`, url);

  requestUrl.searchParams.append(DRAFT, String(showDraft));
  requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}

export async function getPosts(
  url: string,
  limit?: number,
  page?: number,
  showDraft = false,
  showMemberContent = false
): Promise<BlogPosts> {
  const requestUrl = new URL(`/api/posts`, url);

  requestUrl.searchParams.append(DRAFT, String(showDraft));
  requestUrl.searchParams.append(MEMBER_CONTENT, String(showMemberContent));

  if (limit) {
    requestUrl.searchParams.append(LIMIT, String(limit));
  }

  if (page) {
    requestUrl.searchParams.append(PAGE, String(page));
  }

  const response = await fetch(requestUrl, { headers });

  if (!response.ok) {
    throw new Error("", { cause: response.status });
  }

  return response.json();
}

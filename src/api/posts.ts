import headers from "@utils/headers";
import { DRAFT, MEMBER_CONTENT } from "@utils/urlParams";
import type { Post } from "@type";

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

//@ts-ignore
import { sanityClient } from "sanity:client";
import type { BlogPosts, Post } from "@type";

export async function getPost(slug: string, showDraft: boolean): Promise<Post> {
  const postQuery = `_type == "post" && slug.current == $slug`;
  const adminQuery = showDraft
    ? postQuery
    : `${postQuery} && defined(publishedAt)`;

  return await sanityClient.fetch(
    `*[${adminQuery}] {
        title, 
        publishedAt, 
        body, 
        mainImage, 
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
        keywords,
        description,
        memberContent,
        "documents": documents[]->{
          title, 
          "slug": slug.current
        }
      }[0]`,
    {
      slug,
    }
  );
}

export async function getPosts(
  showDraft = false,
  showMemberContent = false,
  page = 1,
  limit = 10
): Promise<BlogPosts> {
  const adminQuery = showDraft
    ? `_type == "post"`
    : `_type == "post" && defined(publishedAt)`;
  const postQuery = showMemberContent
    ? adminQuery
    : `${adminQuery} && memberContent == false`;

  const postCount: number = await sanityClient.fetch(`count(*[${postQuery}])`);
  const pages = Math.ceil(postCount / limit);
  const currentPage = page <= pages ? page : 1;
  const startIndex = (currentPage - 1) * limit;
  const endIndex = currentPage * limit;
  const queryOrder = showDraft ? `_updatedAt` : `publishedAt`;
  const posts: Post[] = await sanityClient.fetch(
    `*[${postQuery}] | order(${queryOrder} desc) [${startIndex}...${endIndex}] { 
          title, 
          publishedAt, 
          "slug": slug.current, 
          mainImage,
          "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
      }`
  );

  return { posts, pages };
}

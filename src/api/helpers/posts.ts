//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Post, SanityDocument } from "@type";

export async function getDocumentPosts(
  documentId: string,
  showMemberContent: boolean
): Promise<SanityDocument> {
  const allPostQuery = `_type=='post' && references(^._id) && defined(publishedAt)`;
  const postQuery = showMemberContent
    ? allPostQuery
    : `${allPostQuery} && memberContent == false`;

  return await sanityClient.fetch(
    `*[_type == 'legalDocument' && slug.current == "${documentId}"] { 
      title, 
      "draft": !publishedAt, 
      body,
      memberContent,
      keywords,
      description,
      "posts": *[${postQuery}] | order(publishedAt desc) [0..2] { 
        title, 
        mainImage, 
        publishedAt,
        slug,
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
      }
  }[0]`
  );
}

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
          slug
        }
      }[0]`,
    {
      slug,
    }
  );
}

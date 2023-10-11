//@ts-ignore
import { sanityClient } from "sanity:client";
import type { SanityDocument } from "@type";
import type { Session } from "@auth/core/types";

export async function getDocumentPosts(
  documentId: string,
  session: Session | null
): Promise<SanityDocument> {
  const allPostQuery = `_type=='post' && references(^._id) && defined(publishedAt)`;
  const postQuery = session
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

import { sanityClient } from "sanity:client";
import trimWhitespace from "@utils/whitespace";
import type { DocumentCategory, DocumentInfo } from "@type";

type SanityTemplate = Pick<DocumentInfo, "title" | "draft" | "memberContent">;

export async function getTemplate(templateId: string): Promise<SanityTemplate> {
  return await sanityClient.fetch(
    `*[_type == 'legalDocument' && slug.current == "${templateId}"] { 
      title, 
      "draft": !defined(publishedAt), 
      memberContent,
  }[0]`
  );
}

export async function getDocumentInfo(
  documentId: string,
  showMemberContent: boolean
): Promise<DocumentInfo> {
  const allPostQuery = `_type=='post' && references(^._id) && defined(publishedAt)`;
  const postQuery = showMemberContent
    ? allPostQuery
    : `${allPostQuery} && memberContent == false`;

  return await sanityClient.fetch(
    `*[_type == 'legalDocument' && slug.current == "${documentId}"] { 
      title, 
      "draft": !defined(publishedAt), 
      priceId,
      body,
      memberContent,
      keywords,
      description,
      "posts": *[${postQuery}] | order(publishedAt desc) [0..2] { 
        title, 
        mainImage, 
        publishedAt,
        "slug": slug.current
      }
  }[0]`
  );
}

export type DocumentTemplate = Pick<
  DocumentInfo,
  "title" | "slug" | "categories" | "memberContent" | "priceId" | "draft"
>;

export async function getTemplates(
  showDarft = false,
  showMemberContent = false,
  category?: string | null,
  search?: string | null
): Promise<DocumentTemplate[]> {
  let query = `_type == 'legalDocument'`;

  if (category) {
    const categoryId = await sanityClient.fetch(
      `*[_type == 'category' && slug.current == "${category}"][0]._id`
    );

    if (categoryId) {
      query += ` && "${categoryId}" in category[]._ref`;
    }
  }

  if (search) {
    query += ` && [title, keywords, description] match "*${trimWhitespace(
      search
    )}*"`;
  }

  if (!showMemberContent) {
    query += ` && memberContent == false`;
  }

  if (!showDarft) {
    query += ` && defined(publishedAt)`;
  }

  const documents: DocumentTemplate[] = await sanityClient.fetch(
    `*[${query}] | order(title asc) { 
      title, 
      "slug": slug.current,
      "draft": !defined(publishedAt), 
      memberContent,
      "categories": category[]->{
        title, 
        "slug": slug.current
      },
      priceId
    }`
  );

  return documents;
}

export async function getCategories(): Promise<DocumentCategory[]> {
  return await sanityClient.fetch(
    `*[_type == "category"] { 
      title, 
      "slug": slug.current,
      showOnIndex,
      keywords,
      description
    }`
  );
}

export async function getDocumentPrice(
  documentId: string
): Promise<Pick<DocumentInfo, "priceId">> {
  return await sanityClient.fetch(
    `*[_type == 'legalDocument' && slug.current == "${documentId}"] { 
      priceId,
  }[0]`
  );
}

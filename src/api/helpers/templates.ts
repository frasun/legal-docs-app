import { getCollection, getEntry } from "astro:content";
import Fuse from "fuse.js";
import trimWhitespace from "@utils/whitespace";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { DocumentInfo } from "@type";

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
      body,
      memberContent,
      keywords,
      description,
      "posts": *[${postQuery}] | order(publishedAt desc) [0..2] { 
        title, 
        mainImage, 
        publishedAt,
        "slug": slug.current,
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
      }
  }[0]`
  );
}

export async function getTemplates(
  showDarft = false,
  showMemberContent = false,
  category?: string | null,
  search?: string | null
) {
  const documents = await getCollection(
    "documents",
    ({ data: { draft, memberContent } }) => {
      const draftCondition = !showDarft ? !draft : true;
      const memberContentCondition = !showMemberContent ? !memberContent : true;

      return draftCondition && memberContentCondition;
    }
  );

  let fitleredDocuments = documents;

  if (category) {
    fitleredDocuments = documents.filter(({ data: { categories } }) =>
      categories.find(({ id }) => id === category)
    );
  }

  if (search) {
    const fuse = new Fuse(fitleredDocuments, {
      keys: ["data.title", "data.keywords"],
      threshold: 0.5,
    });

    const searchResults = fuse.search(trimWhitespace(search));
    fitleredDocuments = searchResults.map((results) => results.item);
  }

  return fitleredDocuments;
}

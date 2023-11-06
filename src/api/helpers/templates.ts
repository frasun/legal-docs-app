import { getCollection, getEntry } from "astro:content";
import Fuse from "fuse.js";
import trimWhitespace from "@utils/whitespace";

export async function getTemplateInfo(documentId: string) {
  return await getEntry("documents", documentId as string);
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

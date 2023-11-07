import { getDocuments } from "@db/document";
import type { UserDocuments } from "@type";
import { LOCALE } from "@utils/date";
import { getEntry } from "astro:content";

export async function getUserDocuments(
  userId: string,
  page = 1
): Promise<UserDocuments> {
  const { documents, pages, currentPage } = await getDocuments(userId, page);
  const documentsWithTemplates = await Promise.all(
    documents.map(async (document) => ({
      template: await getDocTitle(document.doc),
      ...document,
    }))
  );

  const groupedItems: UserDocuments["documents"] = {};

  documentsWithTemplates.forEach((item) => {
    const date = item.modified || item.created;

    if (date) {
      const monthYear = date.toLocaleString(LOCALE, {
        month: "long",
        year: "numeric",
      });

      if (!groupedItems[monthYear]) {
        groupedItems[monthYear] = [];
      }

      groupedItems[monthYear].push(item);
    }
  });

  return { documents: groupedItems, pages, currentPage };
}

async function getDocTitle(docId: string) {
  const docEntry = await getEntry("documents", docId);
  let docTitle = "";

  if (docEntry) {
    const {
      data: { title },
    } = docEntry;
    docTitle = title;
  }

  return docTitle;
}

import { getDocuments } from "@db/document";
import type { UserDocuments } from "@type";
import { LOCALE } from "@utils/date";
import { getTemplates } from "@api/helpers/templates";
import type { DocumentTemplate } from "@api/helpers/templates";

export async function getUserDocuments(
  userId: string,
  page = 1
): Promise<UserDocuments> {
  const { documents, pages, currentPage } = await getDocuments(userId, page);
  const templates = await getTemplates(true, true);

  const documentsWithTemplates = await Promise.all(
    documents.map(async (document) => ({
      template: await getDocTitle(document.doc, templates),
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

async function getDocTitle(docId: string, templates: DocumentTemplate[]) {
  const docEntry = templates.find(({ slug }) => slug === docId);

  let docTitle = "";

  if (docEntry) {
    const { title } = docEntry;
    docTitle = title;
  }

  return docTitle;
}

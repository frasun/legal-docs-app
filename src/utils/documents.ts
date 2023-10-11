import { getEntry } from "astro:content";

export async function getDocumentInfo(documentId: string) {
  return await getEntry("documents", documentId as string);
}

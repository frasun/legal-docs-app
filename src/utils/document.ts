import { changeDocumentName } from "../../db/document";

export async function handleNameChange(formData) {
  const docId = formData.get("template");
  const title = String(formData.get("title")).replace(/\s+/g, " ").trim();

  if (title && docId) {
    await changeDocumentName(docId, title);
  }
}

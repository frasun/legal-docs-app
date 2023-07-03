import { changeDocumentName } from "../../db/document";
import trimWhitespace from "./whitespace";

export async function handleNameChange(formData) {
  const docId = formData.get("template");
  const title = trimWhitespace(String(formData.get("title")));

  if (title && docId) {
    await changeDocumentName(docId, title);
  }
}

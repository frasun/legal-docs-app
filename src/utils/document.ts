import { changeDocumentName } from "@db/document";
import trimWhitespace from "@utils/whitespace";

export async function handleNameChange(formData: FormData) {
  const docId = formData.get("template");
  const title = trimWhitespace(String(formData.get("title")));

  if (title && docId) {
    try {
      await changeDocumentName(String(docId), title);
    } catch {}
  }
}

import { deleteDocument } from "@api/documents";
import { DOCUMENT_REMOVED } from "@utils/toasts";
import { displayError, displayToast } from "@stores/toast";

class DeleteDocument extends HTMLElement {
  documentId: string | undefined;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        await deleteDocument(this.documentId);
        displayToast(DOCUMENT_REMOVED, true);
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("delete-document", DeleteDocument);

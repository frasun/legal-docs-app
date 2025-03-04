import { COPY_DOCUMENT } from "@utils/toasts";
import { copyDocument } from "@api/documents";
import { displayError, displayToast } from "@stores/toast";

class CopyDocument extends HTMLElement {
  documentId: string | undefined;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        await copyDocument(this.documentId);
        displayToast(COPY_DOCUMENT, true, window.location.pathname);
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("copy-document", CopyDocument);

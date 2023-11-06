import { COPY_DOCUMENT_PARAM } from "@utils/toasts";
import { copyDocument } from "@api/documents";

class CopyDocument extends HTMLElement {
  button: HTMLButtonElement | null;
  documentId: string | undefined;

  constructor() {
    super();

    this.button = this.querySelector("button");
    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", async () => {
        const redirectUrl = new URL(window.location.href);
        redirectUrl.search = "";

        if (this.documentId) {
          try {
            await copyDocument(document.cookie, this.documentId);

            redirectUrl.searchParams.set(COPY_DOCUMENT_PARAM, "1");
          } catch {
            redirectUrl.searchParams.set(COPY_DOCUMENT_PARAM, "0");
          } finally {
            window.requestAnimationFrame(() => {
              window.history.pushState({}, "", redirectUrl);
              window.location.reload();
            });
          }
        }
      });
    }
  }
}
customElements.define("copy-document", CopyDocument);

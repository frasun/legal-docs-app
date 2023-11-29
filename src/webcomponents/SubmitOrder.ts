import { initDocumentOrder } from "@api/documents";
import { displayError } from "@stores/toast";

class SubmitOrder extends HTMLElement {
  documentId?: string;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        const url = await initDocumentOrder(this.documentId);

        window.location.href = url.toString();
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("submit-order", SubmitOrder);

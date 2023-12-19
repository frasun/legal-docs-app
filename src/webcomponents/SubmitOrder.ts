import { initDocumentOrder } from "@api/documents";
import { displayError } from "@stores/toast";
import { navigate } from "astro:transitions/client";

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

        navigate(url.toString());
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("submit-order", SubmitOrder);

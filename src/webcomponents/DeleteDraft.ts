import { deleteDraft } from "@api/documents";
import { DRAFT_REMOVED } from "@utils/toasts";
import { displayError, displayToast } from "@stores/toast";

class DeleteDraft extends HTMLElement {
  documentId: string | undefined;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        await deleteDraft(this.documentId);
        displayToast(DRAFT_REMOVED, true);
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("delete-draft", DeleteDraft);

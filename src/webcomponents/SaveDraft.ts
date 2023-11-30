import { postDocument } from "@api/documents";
import { DRAFT_SAVED } from "@utils/toasts";
import { displayError, displayToast } from "@stores/toast";
import routes from "@utils/routes";
import * as PARAMS from "@utils/urlParams";

class SaveDraft extends HTMLElement {
  documentId: string | undefined;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        const { id } = await postDocument(this.documentId, true);

        if (!id) {
          throw new Error();
        }

        displayToast(DRAFT_SAVED, true, routes.MY_DOCUMENTS);
      } catch (e) {
        if (e instanceof Error && e.cause === 401) {
          window.location.href = `${routes.SIGN_IN}?${PARAMS.REDIRECT}=${routes.DOCUMENT}?${PARAMS.DOCUMENT}=${this.documentId}&${PARAMS.DRAFT}=true`;
        } else {
          displayError();
        }
      }
    });
  }
}
customElements.define("save-draft", SaveDraft);

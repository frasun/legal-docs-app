import { displayError, displayToast } from "@stores/toast";
import { IDENTITY_REMOVED } from "@utils/toasts";
import { deleteIdentity } from "@api/identities";

class DeleteIdentity extends HTMLElement {
  identityId: string | undefined;

  constructor() {
    super();

    this.identityId = this.dataset.identityId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        await deleteIdentity(this.identityId);
        displayToast(IDENTITY_REMOVED, true);
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("delete-identity", DeleteIdentity);

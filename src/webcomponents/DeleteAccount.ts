import { displayError } from "@stores/toast";
import { deleteUserAccount } from "@api/users";
import { signOut } from "auth-astro/client";

class DeleteAccount extends HTMLElement {
  documentId: string | undefined;

  constructor() {
    super();

    this.documentId = this.dataset.documentId;
  }

  connectedCallback() {
    this.addEventListener("click", async () => {
      try {
        await deleteUserAccount();
        signOut({ callbackUrl: window.location.origin });
      } catch {
        displayError();
      }
    });
  }
}
customElements.define("delete-account", DeleteAccount);

import { displayError, displayToast } from "@stores/toast";
import { IDENTITY_SAVED, IDENTITY_UPDATED } from "@utils/toasts";
import routes from "@utils/routes";
import { postIdentity, updateIdentity } from "@api/identities";
import { entityEnum } from "@utils/constants";
import { Identity } from "@type";
import { handleFormValidation } from "@utils/errors";

class IdentityForm extends HTMLElement {
  form?: HTMLFormElement;
  identityId?: string;

  constructor() {
    super();

    this.form = this.querySelector("form") ?? undefined;
    this.identityId = this.dataset.identityId ?? undefined;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
  }

  async handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      const formData = new FormData(this.form);
      const identity: Identity = {
        type:
          formData.get("type") === entityEnum.PERSONAL
            ? entityEnum.PERSONAL
            : entityEnum.COMPANY,
        name: String(formData.get("name") || ""),
        pin: String(formData.get("pin") || ""),
        street: String(formData.get("street") || ""),
        apt: String(formData.get("apt") || ""),
        postalCode: String(formData.get("postalCode") || ""),
        city: String(formData.get("city") || ""),
      };

      if (this.identityId) {
        await updateIdentity(this.identityId, identity);
        displayToast(IDENTITY_UPDATED, true, routes.IDENTITIES);
      } else {
        await postIdentity(identity);
        displayToast(IDENTITY_SAVED, true, routes.IDENTITIES);
      }
    } catch (e) {
      if (e instanceof Error && e.cause === 400) {
        handleFormValidation(this, e);
      } else {
        displayError();
      }
    }
  }
}
customElements.define("identity-form", IdentityForm);

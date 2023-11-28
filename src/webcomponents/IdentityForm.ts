import { displayError, displayToast } from "@stores/toast";
import { IDENTITY_SAVED, IDENTITY_UPDATED } from "@utils/toasts";
import routes from "@utils/routes";
import { postIdentity, updateIdentity } from "@api/identities";
import { entityEnum } from "@utils/constants";
import { Identity } from "@type";

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
      const dataType = formData.get("Type");

      let name: Identity["name"],
        pin: Identity["pin"],
        street: Identity["street"],
        apt: Identity["apt"],
        postalCode: Identity["postalCode"],
        city: Identity["city"];

      switch (dataType) {
        case entityEnum[0]:
          name = String(formData.get("PersonName") || "");
          pin = String(formData.get("PersonPin") || "");
          street = String(formData.get("PersonStreet") || "");
          apt = String(formData.get("PersonApt") || "");
          postalCode = String(formData.get("PersonPostalCode") || "");
          city = String(formData.get("PersonCity") || "");
          break;
        case entityEnum[1]:
          name = String(formData.get("CompanyName") || "");
          pin = String(formData.get("CompanyPin") || "");
          street = String(formData.get("CompanyStreet") || "");
          apt = String(formData.get("CompanyApt") || "");
          postalCode = String(formData.get("CompanyPostalCode") || "");
          city = String(formData.get("CompanyCity") || "");
          break;
        default:
          throw new Error(undefined, { cause: 400 });
      }

      const identity = {
        type: dataType,
        name,
        pin,
        street,
        apt,
        postalCode,
        city,
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
        const erros = e.message.split(",");

        displayError(erros);
      } else {
        displayError();
      }
    }
  }
}
customElements.define("identity-form", IdentityForm);

import { getIdentity } from "@api/identities";
import { displayGenericError } from "@utils/toasts";

class IdentitySelector extends HTMLElement {
  selector: HTMLSelectElement | null;
  userId: string | null;

  constructor() {
    super();

    this.selector = this.querySelector("select");
    this.userId = this.getAttribute("data-userid");
  }

  connectedCallback() {
    if (this.selector) {
      const dataSelector = document.querySelector("data-selector");

      this.selector.addEventListener("change", async () => {
        if (this.selector?.value && this.userId) {
          try {
            const detail = await getIdentity(
              document.cookie,
              this.userId,
              this.selector?.value
            );

            dataSelector?.dispatchEvent(
              new CustomEvent("select-identity", { detail })
            );
          } catch {
            displayGenericError();
          }
        }
      });
    }
  }
}

customElements.define("identity-selector", IdentitySelector);

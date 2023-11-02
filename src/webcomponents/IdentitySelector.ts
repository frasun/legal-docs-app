import { getIdentity } from "@api/identities";
import { displayGenericError } from "@utils/toasts";

class IdentitySelector extends HTMLElement {
  selector: HTMLSelectElement | null;

  constructor() {
    super();

    this.selector = this.querySelector("select");
  }

  connectedCallback() {
    if (this.selector) {
      const dataSelector = document.querySelector("data-selector");

      this.selector.addEventListener("change", async () => {
        if (this.selector?.value) {
          try {
            const detail = await getIdentity(
              document.cookie,
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

import { getIdentity } from "@api/identities";
import { displayError } from "@stores/toast";

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
            const detail = await getIdentity(this.selector?.value);

            dataSelector?.dispatchEvent(
              new CustomEvent("select-identity", { detail })
            );
          } catch {
            displayError();
          }
        }
      });
    }
  }
}

customElements.define("identity-selector", IdentitySelector);

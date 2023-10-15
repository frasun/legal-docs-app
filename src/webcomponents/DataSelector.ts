import { entityEnum } from "@utils/constants";

class DataSelector extends HTMLElement {
  selector: HTMLSelectElement | null;
  fieldsets: NodeListOf<HTMLFieldSetElement>;
  prefix: string | null;

  constructor() {
    super();

    this.selector = this.querySelector("select");
    this.fieldsets = this.querySelectorAll("fieldset");
    this.prefix = this.getAttribute("data-prefix");
  }

  connectedCallback() {
    if (this.selector) {
      this.selector.addEventListener("change", () => {
        const activeTab = this.selector?.value;

        if (activeTab) {
          Array.from(this.fieldsets).forEach((fieldset) => {
            if (fieldset.getAttribute("data-type") === activeTab) {
              fieldset.removeAttribute("style");
            } else {
              fieldset.style.display = "none";
              const inputs = fieldset.querySelectorAll("input");

              if (Array.from(inputs).length) {
                Array.from(inputs).forEach((input) => {
                  input.value = "";
                });
              }
            }
          });
        }
      });
    }

    this.addEventListener("select-identity", ((event: CustomEvent) => {
      if (event.detail) {
        const { type, name, pin, street, apt, postalCode, city } = event.detail;
        let typePrefix = "";
        let fieldPrefix = "";

        switch (type) {
          case entityEnum[0]:
            typePrefix = "Person";
            break;
          case entityEnum[1]:
            typePrefix = "Company";
            break;
          default:
            return;
        }

        if (this.prefix) {
          fieldPrefix = `${this.prefix}${typePrefix}`;
        }

        const typeField = this.querySelector(
          "[name*='Type']"
        ) as HTMLSelectElement;
        const nameField = this.querySelector(
          `[name*="${fieldPrefix}Name"]`
        ) as HTMLInputElement;
        const pinField = this.querySelector(
          `[name*="${fieldPrefix}Pin"]`
        ) as HTMLInputElement;
        const streetField = this.querySelector(
          `[name*="${fieldPrefix}Street"]`
        ) as HTMLInputElement;
        const aptField = this.querySelector(
          `[name*="${fieldPrefix}Apt"]`
        ) as HTMLInputElement;
        const postalCodeField = this.querySelector(
          `[name*="${fieldPrefix}PostalCode"]`
        ) as HTMLInputElement;
        const cityField = this.querySelector(
          `[name*="${fieldPrefix}City"]`
        ) as HTMLInputElement;

        if (typeField) {
          typeField.value = type;
          typeField.dispatchEvent(new Event("change"));
        }

        if (nameField) {
          nameField.value = name;
        }

        if (pinField) {
          pinField.value = pin;
        }

        if (streetField) {
          streetField.value = street;
        }

        if (aptField) {
          aptField.value = apt;
        }

        if (postalCodeField) {
          postalCodeField.value = postalCode;
        }

        if (cityField) {
          cityField.value = city;
        }
      }
    }) as EventListener);
  }
}

customElements.define("data-selector", DataSelector);

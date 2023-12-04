class DataSelector extends HTMLElement {
  selector: HTMLSelectElement | null;
  fields: NodeListOf<HTMLInputElement>;

  constructor() {
    super();

    this.selector = this.querySelector("select");
    this.fields = this.querySelectorAll("fieldset input");
  }

  connectedCallback() {
    this.selector?.addEventListener("change", this.dataTypeChanged.bind(this));

    this.addEventListener(
      "select-identity",
      this.handleSelectIdentity.bind(this) as EventListener
    );
  }

  dataTypeChanged(event: Event) {
    const selectedType = (event.target as HTMLSelectElement)?.value;

    Array.from(this.querySelectorAll<HTMLElement>("[data-type]")).forEach(
      (element) => {
        if (element.dataset.type === selectedType) {
          element.removeAttribute("style");
        } else {
          element.style.display = "none";
        }
      }
    );
  }

  handleSelectIdentity(event: CustomEvent) {
    if (event.detail) {
      const { type, name, pin, street, apt, postalCode, city } = event.detail;

      const typeField = this.querySelector("#type") as HTMLSelectElement;
      const nameField = this.querySelector("#name") as HTMLInputElement;
      const pinField = this.querySelector("#pin") as HTMLInputElement;
      const streetField = this.querySelector("#street") as HTMLInputElement;
      const aptField = this.querySelector("#apt") as HTMLInputElement;
      const postalCodeField = this.querySelector(
        "#postalCode"
      ) as HTMLInputElement;
      const cityField = this.querySelector("#city") as HTMLInputElement;

      typeField.value = type;
      nameField.value = name;
      pinField.value = pin;
      streetField.value = street;
      aptField.value = apt;
      postalCodeField.value = postalCode;
      cityField.value = city;
    }
  }
}

customElements.define("data-selector", DataSelector);

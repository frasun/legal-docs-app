import { DATA_TYPE } from "@utils/urlParams";

class DataTypeSelector extends HTMLElement {
  select: HTMLSelectElement;

  constructor() {
    super();

    this.select = this.querySelector("select") as HTMLSelectElement;
  }

  connectedCallback() {
    this.select.addEventListener("change", (event) => {
      const val = (event.target as HTMLInputElement).value;
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      if (val.length) {
        params.set(DATA_TYPE, encodeURIComponent(val));
      } else {
        params.delete(DATA_TYPE);
      }

      url.search = params.toString();
      document.location = url.toString();
    });
  }
}
customElements.define("data-type-selector", DataTypeSelector);

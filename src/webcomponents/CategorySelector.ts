import { navigate } from "astro:transitions/client";
import * as PARAMS from "@utils/urlParams";

class CategorySelector extends HTMLElement {
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
        params.set(PARAMS.CATEGORY, val);
      } else {
        params.delete(PARAMS.CATEGORY);
      }

      url.search = params.toString();
      navigate(url);
    });
  }
}
customElements.define("category-selector", CategorySelector);

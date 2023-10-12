import * as PARAMS from "@utils/urlParams";

class SearchDocuments extends HTMLElement {
  button: HTMLButtonElement | null;

  constructor() {
    super();

    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", (event) => {
        event.preventDefault();
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        params.delete(PARAMS.SEARCH);

        url.search = params.toString();
        document.location = url.toString();
      });
    }
  }
}
customElements.define("search-documents", SearchDocuments);

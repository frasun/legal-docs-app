class PageSpinner extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    document.addEventListener("astro:before-preparation", () => {
      this.classList.remove("hidden");
    });

    document.addEventListener("astro:after-preparation", () => {
      this.classList.add("hidden");
    });
  }
}

customElements.define("page-spinner", PageSpinner);

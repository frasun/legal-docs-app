class PageSpinner extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    document.addEventListener("astro:before-preparation", () => {
      window.requestAnimationFrame(() => {
        this.classList.remove("hidden");
      });
    });

    document.addEventListener("astro:after-swap", () => {
      window.requestAnimationFrame(() => {
        this.classList.add("hidden");
      });
    });
  }
}

customElements.define("page-spinner", PageSpinner);

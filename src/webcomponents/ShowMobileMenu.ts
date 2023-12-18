class ShowMobileMenu extends HTMLElement {
  button: HTMLButtonElement | null;

  constructor() {
    super();

    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", () => {
        document.body.dispatchEvent(new CustomEvent("showMobileMenu"));
      });
    }
  }
}
customElements.define("show-mobile-menu", ShowMobileMenu);

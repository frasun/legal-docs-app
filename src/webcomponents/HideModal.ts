class HideModal extends HTMLElement {
  button: HTMLButtonElement | null;

  constructor() {
    super();

    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", (e) => {
        e.preventDefault();

        document.body.dispatchEvent(new CustomEvent("hideModal"));
      });
    }
  }
}

customElements.define("hide-modal", HideModal);

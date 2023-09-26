class ShowModal extends HTMLElement {
  button: HTMLButtonElement | null;
  modalId: string | undefined;

  constructor() {
    super();

    this.button = this.querySelector("button");
    this.modalId = this.dataset.modal;
  }

  connectedCallback() {
    if (this.button && this.modalId) {
      this.button.addEventListener("click", () => {
        document.body.dispatchEvent(
          new CustomEvent("showModal", { detail: { modalId: this.modalId } })
        );
      });
    }
  }
}

customElements.define("show-modal", ShowModal);

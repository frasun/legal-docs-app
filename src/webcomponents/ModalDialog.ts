import Modal, { DEFAULT_MODAL } from "@utils/modal";

class ModalDialog extends HTMLElement {
  modalId: string;
  modalContainer: HTMLElement | null;
  modalClose: HTMLButtonElement | null;

  constructor() {
    super();

    this.modalId = this.dataset.modalId || DEFAULT_MODAL;
    this.modalContainer = document.getElementById(this.modalId);
    this.modalClose =
      this.modalContainer && this.modalContainer.querySelector("#modalClose");
  }

  connectedCallback() {
    if (this.modalContainer && this.modalClose) {
      const modal = new Modal(this.modalContainer, this.modalClose);
      document.body.addEventListener("showModal", ((event: CustomEvent) => {
        if (event.detail) {
          const { modalId } = event.detail;

          if (modalId === this.modalId) {
            modal.show();
          }
        } else if (this.modalId === DEFAULT_MODAL) {
          modal.show();
        }
      }) as EventListener);

      document.body.addEventListener("hideModal", () => {
        modal.hide();
      });
    }
  }
}

customElements.define("modal-dialog", ModalDialog);

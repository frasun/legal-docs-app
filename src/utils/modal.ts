import * as backdrop from "@utils/backdrop";

export const DEFAULT_MODAL = "modal";

export default class Modal {
  modal: HTMLElement;
  modalClose: HTMLElement;
  MODAL_TOUCHED: string;
  MODAL_OPEN: string;

  constructor(modal: HTMLElement, modalClose: HTMLElement) {
    this.MODAL_TOUCHED = "touched";
    this.MODAL_OPEN = "open";
    this.modal = modal;
    this.modalClose = modalClose;
  }

  show() {
    backdrop.addBackdrop(() => {
      this.hide();
    });

    if (this.modal) {
      this.modal.classList.add(this.MODAL_TOUCHED);
      this.modal.classList.add(this.MODAL_OPEN);
    }

    if (this.modalClose) {
      this.modalClose.addEventListener("click", () => {
        this.hide();
      });
    }
  }

  hide() {
    backdrop.removeBackdrop();
    this.modal.classList.remove(this.MODAL_OPEN);

    document.body.dispatchEvent(new CustomEvent("modalHidden"));
  }
}

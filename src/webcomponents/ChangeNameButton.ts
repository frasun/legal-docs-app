class ChangeNameButton extends HTMLElement {
  doctitle?: string;
  docId?: string;

  constructor() {
    super();

    this.doctitle = this.dataset.title;
    this.docId = this.dataset.docId;
  }

  connectedCallback() {
    this.addEventListener("click", () => {
      document.body.dispatchEvent(new CustomEvent("showModal"));

      const form = document.querySelector("change-name-form");

      if (form && this.doctitle && this.docId) {
        form.dispatchEvent(
          new CustomEvent("change-name", {
            detail: { title: this.doctitle, docId: this.docId },
          })
        );
      }
    });
  }
}
customElements.define("change-name-button", ChangeNameButton);

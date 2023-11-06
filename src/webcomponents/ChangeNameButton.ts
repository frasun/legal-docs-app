class ChangeNameButton extends HTMLElement {
  button: HTMLButtonElement | null;
  doctitle: string | null;
  docId: string | null;

  constructor() {
    super();

    this.doctitle = this.getAttribute("data-title");
    this.docId = this.getAttribute("data-doc-id");
    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", () => {
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
}
customElements.define("change-name-button", ChangeNameButton);

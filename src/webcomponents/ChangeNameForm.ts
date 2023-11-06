class ChangeNameForm extends HTMLElement {
  input: HTMLInputElement | null;
  hiddenInput: HTMLInputElement | null;
  form: HTMLFormElement | null;
  title: string;
  docId: string;

  constructor() {
    super();

    this.form = this.querySelector("form");
    this.input = this.querySelector("input[type='text']");
    this.hiddenInput = this.querySelector("input[type='hidden']");
    this.title = "";
    this.docId = "";
  }

  connectedCallback() {
    this.addEventListener("change-name", ((event: CustomEvent) => {
      this.title = event.detail.title;
      this.docId = event.detail.docId;

      if (this.input) {
        this.input.value = this.title;
      }

      if (this.hiddenInput) {
        this.hiddenInput.value = this.docId;
      }
    }) as EventListener);

    if (this.form) {
      this.form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(this.form || undefined);
        const newTitle = formData.get("title");

        if (newTitle !== this.title && String(newTitle).trim() !== "") {
          this.form && this.form.submit();
        } else {
          document.body.dispatchEvent(new CustomEvent("hideModal"));
        }
      });
    }
  }
}
customElements.define("change-name-form", ChangeNameForm);

class QuestionForm extends HTMLElement {
  form: HTMLFormElement | null;
  submit: HTMLButtonElement | null;

  constructor() {
    super();

    this.form = this.querySelector("form");
    this.submit = this.form
      ? this.form.querySelector("button[type='submit']")
      : null;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("input", () => {
        if (this.submit) {
          this.submit.removeAttribute("disabled");
        }
      });
    }
  }
}
customElements.define("question-form", QuestionForm);

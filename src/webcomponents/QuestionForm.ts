import { postAnswers } from "@api/documents";
import { displayError, displayToast } from "@stores/toast";
import { Answers } from "@type";
import { ANSWER_UPDATED } from "@utils/toasts";

class QuestionForm extends HTMLElement {
  form?: HTMLFormElement;
  submit: HTMLButtonElement | null;
  answers: Answers;
  documentId: string;
  nextUrl: string;

  constructor() {
    super();

    this.form = this.querySelector("form") ?? undefined;
    this.submit = this.form
      ? this.form.querySelector("button[type='submit']")
      : null;
    this.answers = {};
    this.documentId = this.dataset.documentId ?? "";
    this.nextUrl = this.dataset.nextUrl ?? "";
  }

  connectedCallback() {
    if (this.form) {
      for (let [key, value] of new FormData(this.form).entries()) {
        Object.assign(this.answers, { [key]: value });
      }

      this.form.addEventListener("input", () => {
        if (this.submit) {
          this.submit.removeAttribute("disabled");
        }
      });

      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
  }

  async handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const newAnswers: Answers = {};

    for (let [key, value] of formData.entries()) {
      if (key in this.answers && value && value !== String(this.answers[key])) {
        Object.assign(newAnswers, { [key]: value });
      }
    }

    if (Object.keys(newAnswers).length) {
      try {
        const modified = await postAnswers(this.documentId, newAnswers);

        if (modified) {
          displayToast(ANSWER_UPDATED);
        } else {
          displayToast(ANSWER_UPDATED, true, this.nextUrl);
        }
      } catch (e) {
        if (e instanceof Error) {
          if (e.cause === 400) {
            displayError(e.message);
          }
        }
      }
    } else {
      window.location.href = this.nextUrl;
    }
  }
}
customElements.define("question-form", QuestionForm);

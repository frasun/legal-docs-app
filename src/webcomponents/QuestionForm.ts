import { postAnswers } from "@api/documents";
import { displayError, displayToast } from "@stores/toast";
import { Answers } from "@type";
import { handleFormValidation } from "@utils/errors";
import { ANSWER_UPDATED } from "@utils/toasts";

class QuestionForm extends HTMLElement {
  form?: HTMLFormElement;
  submit?: HTMLButtonElement;
  documentId: string;
  nextUrl?: string;
  answers: Answers;
  hiddenFields: NodeListOf<HTMLInputElement> | undefined;

  constructor() {
    super();

    this.form = this.querySelector("form") ?? undefined;
    this.submit =
      this.form?.querySelector("button[type='submit']") ?? undefined;
    this.documentId = this.dataset.documentId ?? "";
    this.nextUrl = this.dataset.nextUrl ?? undefined;
    this.answers = {};
    this.hiddenFields = this.form?.querySelectorAll('[type="hidden"]');
  }

  connectedCallback() {
    this.getInitialAnswers();

    this.form?.addEventListener("submit", this.handleFormSubmit.bind(this));
    this.form?.addEventListener("input", this.handleFormInput.bind(this));
  }

  getInitialAnswers() {
    const formData = new FormData(this.form);
    for (let [key, value] of formData.entries()) {
      Object.assign(this.answers, { [key]: value });
    }
  }

  async handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    const answers = new FormData(this.form).entries();
    const newAnswers: Answers = {};
    let hasNewAnswers = false;

    if (this.hiddenFields?.length) {
      this.hiddenFields.forEach(({ name, value, dataset }) => {
        const { type, key } = dataset;

        if (type === "array") {
          if (value !== this.answers[name]) {
            hasNewAnswers = true;
          }

          const val = value.length ? value.split(",") : [];

          if (key) {
            this.addAnswer(newAnswers, key, val, name);
          } else {
            Object.assign(newAnswers, {
              [name]: val,
            });
          }
        } else {
          if (value) {
            if (value !== this.answers[name]) {
              hasNewAnswers = true;
            }

            Object.assign(newAnswers, { [name]: value });
          } else {
            for (let [key, value] of answers) {
              if (key !== name) {
                if (value !== this.answers[key]) {
                  hasNewAnswers = true;
                }

                this.addAnswer(newAnswers, name, value, key);
              }
            }
          }
        }
      });
    } else {
      for (let [key, value] of answers) {
        if (value !== this.answers[key]) {
          hasNewAnswers = true;
        }

        Object.assign(newAnswers, { [key]: value });
      }
    }

    if (hasNewAnswers) {
      try {
        const modified = await postAnswers(this.documentId, newAnswers);
        if (modified) {
          displayToast(ANSWER_UPDATED);

          this.answers = new FormData(this.form);
        } else {
          displayToast(ANSWER_UPDATED, true, this.nextUrl);
        }
      } catch (e) {
        if (e instanceof Error && e.cause === 400) {
          handleFormValidation(this, e);
        } else {
          displayError();
        }
      }
    } else {
      if (this.nextUrl) {
        window.location.href = this.nextUrl;
      }
    }
  }

  handleFormInput() {
    if (this.submit && this.submit.hasAttribute("disabled")) {
      this.submit.removeAttribute("disabled");
    }

    this.form?.removeEventListener("input", this.handleFormInput);
  }

  addAnswer(answers: Answers, name: string, value: unknown, key: string) {
    if (!(name in answers)) {
      Object.assign(answers, { [name]: {} });
    }

    Object.assign(answers[name], { [key]: value });
  }
}
customElements.define("question-form", QuestionForm);

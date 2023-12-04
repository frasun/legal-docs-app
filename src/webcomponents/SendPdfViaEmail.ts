import { isEmail } from "@utils/validation";
import { getContentArray } from "@utils/pdf";
import { WRONG_EMAIL_FORMAT } from "@utils/response";
import { DOCUMENT_SHARED } from "@utils/toasts";
import trimWhiteSpace from "@utils/whitespace";
import { shareDocument } from "@api/documents";
import { displayError, displayToast } from "@stores/toast";

class SendPdfViaEmail extends HTMLElement {
  form: HTMLFormElement | null;
  contentId: string | undefined;
  documentId: string | undefined;
  errors: string[];
  loader: SVGElement | null;

  constructor() {
    super();

    this.form = this.querySelector("form");
    this.contentId = this.dataset.contentId;
    this.documentId = this.dataset.documentId;
    this.errors = [];
    this.loader = this.querySelector("svg");
  }

  connectedCallback() {
    if (this.form && this.contentId) {
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }
  }

  async handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      const formData = new FormData(this.form as HTMLFormElement);
      const sendToMe = formData.has("sendToMe");
      const email1 = formData.get("email1");
      const email2 = formData.get("email2");
      const emails = [];

      if (this.loader) {
        this.loader.style.display = "block";
      }

      if (email1 && email1.length) {
        emails.push(trimWhiteSpace(email1 as string));
      }

      if (email2 && email2.length) {
        emails.push(trimWhiteSpace(email2 as string));
      }

      if (emails.length) {
        for (let email of emails) {
          if (!isEmail(email)) {
            this.errors.push(`${WRONG_EMAIL_FORMAT}: ${email}`);
          }
        }
      }

      if (!emails.length && !sendToMe) {
        this.errors.push("Podaj przynajmniej jeden adres e-mail");
      }

      if (this.errors.length) {
        throw new Error(undefined, { cause: 400 });
      }

      const docContent = document.querySelector(`${this.contentId}`);

      if (docContent && !this.errors.length) {
        const title = docContent.getAttribute("data-title");
        const template = docContent.getAttribute("data-template");

        if (this.documentId) {
          const data = {
            pdf: getContentArray(docContent),
            emails,
            sendToMe,
            title,
            template,
          };

          await shareDocument(this.documentId, data);

          displayToast(DOCUMENT_SHARED, true);
        }
      }
    } catch {
      if (this.errors.length) {
        displayError(this.errors);
        this.errors = [];
      } else {
        displayError();
      }

      if (this.loader) {
        this.loader.removeAttribute("style");
      }
    }
  }
}

customElements.define("send-via-email", SendPdfViaEmail);

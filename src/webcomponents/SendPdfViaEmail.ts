import { emailRegExp, testString } from "@utils/dataValidation";
import { getContentArray } from "@utils/pdf";
import { WRONG_EMAIL_FORMAT } from "@utils/response";
import { DOCUMENT_SHARED_PARAM } from "@utils/toasts";
import trimWhiteSpace from "@utils/whitespace";

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
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

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
            const isEmail = testString(email, emailRegExp);

            if (!isEmail) {
              this.errors.push(`${WRONG_EMAIL_FORMAT}: ${email}`);
            }
          }
        }

        if (!emails.length && !sendToMe) {
          this.errors.push("Podaj przynajmniej jeden adres e-mail");
        }

        const docContent = document.querySelector(`${this.contentId}`);

        if (docContent && !this.errors.length) {
          const title = docContent.getAttribute("data-title");
          const template = docContent.getAttribute("data-template");
          const redirectUrl = new URL(window.location.href);
          redirectUrl.search = "";

          try {
            const response = await fetch(
              `/api/documents/${this.documentId}/share`,
              {
                method: "POST",
                body: JSON.stringify({
                  pdf: getContentArray(docContent),
                  emails,
                  sendToMe,
                  title,
                  template,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200) {
              redirectUrl.searchParams.set(DOCUMENT_SHARED_PARAM, "1");
            } else {
              redirectUrl.searchParams.set(DOCUMENT_SHARED_PARAM, "0");
            }
          } catch {
            redirectUrl.searchParams.set(DOCUMENT_SHARED_PARAM, "0");
          } finally {
            document.body.dispatchEvent(new CustomEvent("hideModal"));

            window.requestAnimationFrame(() => {
              window.history.pushState({}, "", redirectUrl);
              window.location.reload();
            });
          }
        }

        if (this.errors.length) {
          this.displayErrors(this.errors);

          if (this.loader) {
            this.loader.removeAttribute("style");
          }
        }
      });
    }

    document.body.addEventListener("modalHidden", () => {
      this.reset(true);
    });
  }

  displayErrors(errors: string[]) {
    const footer = document.createElement("footer");

    for (let error of errors) {
      let p = document.createElement("p");
      p.classList.add("text-orangeDark");
      p.innerText = error;
      footer.append(p);
    }

    (this.form as HTMLFormElement).append(footer);

    this.errors = [];
  }

  reset(init = false) {
    const footer = this.querySelector("form > footer");
    const sendToMe = this.form?.querySelector("input[name='sendToMe']");
    const inputs: NodeListOf<HTMLInputElement> = this.querySelectorAll(
      'input[type="email"]'
    );

    if (footer) {
      footer.remove();
    }

    if (Array.from(inputs).length) {
      Array.from(inputs).forEach((input) => {
        input.value = "";
      });
    }

    if (init && sendToMe) {
      (sendToMe as HTMLInputElement).checked = true;
    }

    if (this.loader) {
      this.loader.removeAttribute("style");
    }
  }
}

customElements.define("send-via-email", SendPdfViaEmail);

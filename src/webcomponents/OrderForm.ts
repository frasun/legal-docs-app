import { initDocumentOrder } from "@api/documents";
import { displayError } from "@stores/toast";
import { isEmail } from "@utils/validation";
import routes from "@utils/routes";
import { navigate } from "astro:transitions/client";

class OrderForm extends HTMLElement {
  form?: HTMLFormElement;
  documentId: string;

  constructor() {
    super();

    this.form = this.querySelector("form") ?? undefined;
    this.documentId = this.dataset.documentId ?? "";
  }

  connectedCallback() {
    this.form?.addEventListener("submit", this.handleSubmitOrder.bind(this));
  }

  async handleSubmitOrder(event: SubmitEvent) {
    event.preventDefault();

    try {
      const formData = new FormData(this.form);

      const anonymousEmail = String(formData.get("email"));

      if (!anonymousEmail || !isEmail(anonymousEmail)) {
        throw new Error();
      }

      const url = await initDocumentOrder(this.documentId, anonymousEmail);

      window.location.href = url.toString();
    } catch (e) {
      if (e instanceof Error) {
        if (e.cause === 303) {
          const redirectUrl = new URL(
            `${routes.DOCUMENTS}/${this.documentId}${routes.DOCUMENT}`,
            window.location.origin
          );

          navigate(redirectUrl.toString());
        } else {
          displayError();
        }
      }
    }
  }
}
customElements.define("order-form", OrderForm);

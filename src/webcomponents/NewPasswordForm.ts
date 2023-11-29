import { displayError, displayToast } from "@stores/toast";
import routes from "@utils/routes";
import error from "@utils/errors";
import { setNewPassword } from "@api/users";
import { PASSWORD_RESET } from "@utils/toasts";

class NewPasswordForm extends HTMLElement {
  form?: HTMLFormElement;
  userEmail?: string;

  constructor() {
    super();

    this.form = this.querySelector("form") ?? undefined;
    this.userEmail = this.dataset.userEmail ?? undefined;
  }

  connectedCallback() {
    this.form?.addEventListener("submit", this.handleSubmitOrder.bind(this));
  }

  async handleSubmitOrder(event: SubmitEvent) {
    event.preventDefault();

    try {
      const formData = new FormData(this.form);
      const verificationCode = formData.get("code") as string;
      const password = formData.get("password") as string;
      const passwordConfirm = formData.get("password-confirm") as string;

      if (password !== passwordConfirm) {
        throw new Error(error.DIFFERENT_PASSWORDS, { cause: 400 });
      }

      await setNewPassword(
        verificationCode,
        this.userEmail as string,
        password
      );

      displayToast(PASSWORD_RESET, true, routes.SIGN_IN);
    } catch (e) {
      if (e instanceof Error) {
        if (e.cause === 400) {
          displayError(e.message);
        } else {
          displayError();
        }
      }
    }
  }
}
customElements.define("new-password-form", NewPasswordForm);

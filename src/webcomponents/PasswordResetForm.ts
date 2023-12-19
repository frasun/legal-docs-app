import { displayError } from "@stores/toast";
import { sendResetCode } from "@api/users";
import routes from "@utils/routes";
import { EMAIL } from "@utils/urlParams";
import { navigate } from "astro:transitions/client";

class PasswordReset extends HTMLElement {
  form?: HTMLFormElement;

  constructor() {
    super();

    this.form = this.querySelector("form") || undefined;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
          const formData = new FormData(this.form);
          const userEmail = formData.get("email") as string;
          const redirectUrl = `${
            routes.SET_PASSWORD
          }?${EMAIL}=${encodeURIComponent(userEmail)}`;

          await sendResetCode(userEmail);

          navigate(redirectUrl);
        } catch (e) {
          if (e instanceof Error && e.cause === 400) {
            displayError(e.message);
          } else {
            displayError();
          }
        }
      });
    }
  }
}
customElements.define("password-reset-form", PasswordReset);

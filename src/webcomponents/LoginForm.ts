import { signIn } from "auth-astro/client";
import errors from "@utils/errors";
import { displayError, displayToast } from "@stores/toast";
import routes from "@utils/routes";

class LoginForm extends HTMLElement {
  form?: HTMLFormElement;
  redirect?: string;
  loginAttempts: number;

  constructor() {
    super();

    this.form = this.querySelector("form") || undefined;
    this.redirect = this.getAttribute("redirect") || undefined;
    this.loginAttempts = 0;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(this.form);
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));

        this.loginAttempts++;

        const response = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl: `${
            this.redirect
              ? this.redirect
              : `${document.location.origin}/moje-dokumenty`
          }`,
        });

        if (response) {
          if (this.loginAttempts > 3) {
            displayToast(errors.LIMIT_LOGIN_ATTEMPTS, true, routes.HOME, true);
          } else {
            displayError(errors.WRONG_CREDENTIALS);
          }
        }
      });
    }
  }
}
customElements.define("login-form", LoginForm);

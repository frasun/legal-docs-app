import { signIn } from "auth-astro/client";
import errors from "@utils/errors";
import { displayError } from "@stores/toast";

class LoginForm extends HTMLElement {
  form?: HTMLFormElement;
  redirect?: string;

  constructor() {
    super();

    this.form = this.querySelector("form") || undefined;
    this.redirect = this.getAttribute("redirect") || undefined;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(this.form);
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));

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
          displayError(errors.WRONG_CREDENTIALS);
        }
      });
    }
  }
}
customElements.define("login-form", LoginForm);

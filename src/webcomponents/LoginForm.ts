import { signIn } from "auth-astro/client";
import errors from "@utils/errors";

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

        this.hideError();

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

        response && this.showError();
      });
    }
  }

  showError() {
    const error = document.createElement("p");
    error.id = "error";
    error.innerHTML = errors.WRONG_CREDENTIALS;

    window.setTimeout(() => {
      if (this.form) {
        this.form.append(error);
      }
    }, 200);
  }

  hideError() {
    const error = this.querySelector("#error");

    if (error) error.remove();
  }
}
customElements.define("login-form", LoginForm);

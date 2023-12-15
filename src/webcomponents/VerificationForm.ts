import { signIn } from "auth-astro/client";
import { displayError } from "@stores/toast";
import { verifyCode } from "@api/users";

class VerificationForm extends HTMLElement {
  form?: HTMLFormElement;
  redirect?: string;
  email: string | null;

  constructor() {
    super();

    this.form = this.querySelector("form") || undefined;
    this.redirect = this.getAttribute("redirect") || undefined;
    this.email = this.getAttribute("email") || null;
  }

  connectedCallback() {
    if (this.form && this.email) {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(this.form);
        const code = formData.get("code") as string;

        try {
          const userPassword = await verifyCode(code, this.email as string);

          await signIn("credentials", {
            redirect: false,
            email: this.email,
            password: userPassword,
            callbackUrl: `${
              this.redirect
                ? this.redirect
                : `${document.location.origin}/moje-dokumenty`
            }`,
          });
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
customElements.define("verification-form", VerificationForm);

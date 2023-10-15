import { signIn } from "auth-astro/client";
import routes from "@utils/routes";

class AutoLogin extends HTMLElement {
  redirect?: string;
  email?: string;
  password?: string;

  constructor() {
    super();

    this.redirect = this.getAttribute("redirect") || undefined;
    this.email = this.getAttribute("email") || undefined;
    this.password = this.getAttribute("password") || undefined;
  }

  async connectedCallback() {
    const response = await signIn("credentials", {
      redirect: false,
      email: this.email,
      password: this.password,
      callbackUrl: `${
        this.redirect
          ? this.redirect
          : `${document.location.origin}/${routes.MY_DOCUMENTS}`
      }`,
    });

    if (response) {
      document.location.href = routes.SIGN_IN;
    }
  }
}
customElements.define("auto-login", AutoLogin);

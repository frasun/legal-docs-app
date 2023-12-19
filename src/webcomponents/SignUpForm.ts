import { signUp } from "@api/users";
import { displayError } from "@stores/toast";
import routes from "@utils/routes";
import * as PARAMS from "@utils/urlParams";
import { navigate } from "astro:transitions/client";

class SignUpForm extends HTMLElement {
  form?: HTMLFormElement;

  constructor() {
    super();

    this.form = this.querySelector("form") || undefined;
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(this.form);
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));
        const tos = String(formData.get("tos"));

        try {
          await signUp(tos, email, password);

          const url = new URL(window.location.href);
          const redirectUrl = new URL(routes.VERIFY, window.location.origin);
          const redirectParam = url.searchParams.get(PARAMS.REDIRECT);
          const docParam = url.searchParams.get(PARAMS.DOCUMENT);
          const draftParam = url.searchParams.get(PARAMS.DRAFT);

          redirectUrl.searchParams.append(
            PARAMS.EMAIL,
            decodeURIComponent(email)
          );

          if (redirectParam) {
            redirectUrl.searchParams.append(PARAMS.REDIRECT, redirectParam);

            if (docParam) {
              redirectUrl.searchParams.append(PARAMS.DOCUMENT, docParam);
            }

            if (draftParam) {
              redirectUrl.searchParams.append(PARAMS.DRAFT, draftParam);
            }
          }

          navigate(redirectUrl.toString());
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
customElements.define("sign-up-form", SignUpForm);

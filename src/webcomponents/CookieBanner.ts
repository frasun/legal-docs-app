import { BANNER_COOKIE } from "@utils/cookies";

class CookieBanner extends HTMLElement {
  button: HTMLButtonElement | null;

  constructor() {
    super();

    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", () => {
        this.setCookie(BANNER_COOKIE, "true");

        window.requestAnimationFrame(() => {
          this.classList.add("animate");

          this.addEventListener("animationend", () => {
            this.remove();
          });
        });
      });
    }
  }

  setCookie(cName: string, cValue: string, expDays = 365) {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }
}

customElements.define("cookie-banner", CookieBanner);

import { BANNER_COOKIE } from "@utils/cookies";

class CookieBanner extends HTMLElement {
  button: NodeListOf<HTMLButtonElement>;

  constructor() {
    super();

    this.button = this.querySelectorAll("button");
  }

  connectedCallback() {
    if (this.button.length) {
      Array.from(this.button).forEach((button) => {
        button.addEventListener("click", () => {
          const answer = button.id === "accept" ? "true" : "false";

          this.setCookie(BANNER_COOKIE, answer);

          window.requestAnimationFrame(() => {
            this.classList.add("animate");

            this.addEventListener("animationend", () => {
              this.remove();
            });
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

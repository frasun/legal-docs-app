import * as backdrop from "@utils/backdrop";
import screens from "@utils/screens";

class AppMenu extends HTMLElement {
  close: HTMLButtonElement | null;
  isOpen: boolean;

  constructor() {
    super();

    this.close = this.querySelector("header > button");
    this.isOpen = false;
  }

  connectedCallback() {
    document.body.addEventListener("showMobileMenu", () => {
      if (window.innerWidth < screens.md) {
        this.showMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= screens.md) {
        this.hideMenu();
      }
    });

    if (this.close) {
      this.close.addEventListener("click", () => {
        if (this.isOpen) {
          this.hideMenu();
        }
      });
    }
  }

  showMenu() {
    backdrop.addBackdrop(() => {
      this.hideMenu();
    });
    this.style.transform = "translateY(100%)";
    this.isOpen = true;
  }

  hideMenu() {
    if (this.isOpen) {
      this.removeAttribute("style");
      backdrop.removeBackdrop();
      this.isOpen = false;
    }
  }
}
customElements.define("app-menu", AppMenu);

import * as utils from "@utils/backdrop";
import screens from "@utils/screens";

class PageMenu extends HTMLElement {
  MENU_BREAKDOWN: number;
  TRANSITION_TRANSFORM: string;
  MENU_ZINDEX: string;
  TRANSLATE_PROP: string;
  menuToggle: HTMLButtonElement | null;
  menuNav: HTMLElement | null;
  _menuOpen: boolean;

  constructor() {
    super();

    this.MENU_BREAKDOWN = screens.lg;
    this.TRANSITION_TRANSFORM = "transition-transform";
    this.MENU_ZINDEX = "z-30";
    this.TRANSLATE_PROP = "--tw-translate-y";

    this.menuToggle = this.querySelector("#menuToggle");
    this.menuNav = this.querySelector("#menuNav");
    this._menuOpen = false;
  }

  connectedCallback() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener("click", () =>
        this.toggleMenu(this._menuOpen)
      );
    }

    window.addEventListener("resize", () => {
      if (this._menuOpen) {
        this.toggleMenu(true, false);
      }
    });
  }

  toggleMenu(isOpen: boolean, transition = true, callback?: Function) {
    if (this.menuNav) {
      transition
        ? this.menuNav.classList.add(this.TRANSITION_TRANSFORM)
        : this.menuNav.classList.remove(this.TRANSITION_TRANSFORM);

      if (!isOpen && window.innerWidth < this.MENU_BREAKDOWN) {
        this.menuNav.style.setProperty(this.TRANSLATE_PROP, "0");
      } else {
        this.menuNav.style.removeProperty(this.TRANSLATE_PROP);
      }

      this.menuNav.addEventListener("transitionend", () => {
        this.classList.remove(this.TRANSITION_TRANSFORM);
        callback && callback();
      });

      if (this.menuToggle) {
        this.menuToggle.setAttribute("data-open", Boolean(!isOpen).toString());
      }
    }

    isOpen
      ? utils.removeBackdrop(transition)
      : utils.addBackdrop(() => {
          this.toggleMenu(true);
        }, this.MENU_ZINDEX);

    this._menuOpen = !isOpen;
  }
}

customElements.define("page-menu", PageMenu);

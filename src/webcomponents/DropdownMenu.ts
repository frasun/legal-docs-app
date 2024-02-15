class DropdownMenu extends HTMLElement {
  button: HTMLButtonElement | null;
  menu: HTMLDivElement | null;
  isOpen: boolean;

  constructor() {
    super();

    this.button = this.querySelector("button");
    this.menu = this.querySelector(".dropdownMenu");
    this.isOpen = false;
  }

  connectedCallback() {
    if (this.button && this.menu) {
      this.button.addEventListener("click", () => {
        if (!this.isOpen) {
          this.dataset.open = "true";

          document.addEventListener("click", this.hideMenu.bind(this), {
            capture: true,
            once: true,
          });
        } else {
          this.removeAttribute("data-open");
        }

        this.isOpen = !this.isOpen;
      });
    }
  }

  hideMenu(event: MouseEvent) {
    if (this.menu) {
      const isOutsideClick = !this.menu.contains(event.target as HTMLElement);

      if (isOutsideClick) {
        this.removeAttribute("data-open");
      }
    }
  }
}

customElements.define("dropdown-menu", DropdownMenu);

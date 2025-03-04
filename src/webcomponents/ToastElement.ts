import { ToastStatus } from "@utils/toasts";
import { $toast, resetToast } from "@stores/toast";

const errorIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd"
    d="M8.6 1c1.6.1 3.1.9 4.2 2c1.3 1.4 2 3.1 2 5.1c0 1.6-.6 3.1-1.6 4.4c-1 1.2-2.4 2.1-4 2.4c-1.6.3-3.2.1-4.6-.7c-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1m.5 12.9c1.3-.3 2.5-1 3.4-2.1c.8-1.1 1.3-2.4 1.2-3.8c0-1.6-.6-3.2-1.7-4.3c-1-1-2.2-1.6-3.6-1.7c-1.3-.1-2.7.2-3.8 1c-1.1.8-1.9 1.9-2.3 3.3c-.4 1.3-.4 2.7.2 4c.6 1.3 1.5 2.3 2.7 3c1.2.7 2.6.9 3.9.6M7.9 7.5L10.3 5l.7.7l-2.4 2.5l2.4 2.5l-.7.7l-2.4-2.5l-2.4 2.5l-.7-.7l2.4-2.5l-2.4-2.5l.7-.7z"
    clip-rule="evenodd" />
  </svg>`;

const successIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
  <g fill="currentColor">
      <path d="M6.27 10.87h.71l4.56-4.56l-.71-.71l-4.2 4.21l-1.92-1.92L4 8.6z" />
      <path fill-rule="evenodd"
          d="M8.6 1c1.6.1 3.1.9 4.2 2c1.3 1.4 2 3.1 2 5.1c0 1.6-.6 3.1-1.6 4.4c-1 1.2-2.4 2.1-4 2.4c-1.6.3-3.2.1-4.6-.7c-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1m.5 12.9c1.3-.3 2.5-1 3.4-2.1c.8-1.1 1.3-2.4 1.2-3.8c0-1.6-.6-3.2-1.7-4.3c-1-1-2.2-1.6-3.6-1.7c-1.3-.1-2.7.2-3.8 1c-1.1.8-1.9 1.9-2.3 3.3c-.4 1.3-.4 2.7.2 4c.6 1.3 1.5 2.3 2.7 3c1.2.7 2.6.9 3.9.6"
          clip-rule="evenodd" />
  </g>
  </svg>`;

class ToastElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const { message, status } = $toast.get();

    if (message) {
      this.showToast(message, status);
    }

    this.listenForChanges();
  }

  listenForChanges() {
    $toast.listen(({ message, status, show }, key) => {
      if (key === "show") {
        if (show && message) {
          this.showToast(message, status);
        }
      }
    });
  }

  showToast(message: string | string[], status: ToastStatus) {
    const icon = status === ToastStatus.error ? errorIcon : successIcon;

    let content = message;

    if (message instanceof Array) {
      content = message.join("<br /><br />");
    }

    this.classList.remove("animate");

    window.requestAnimationFrame(() => {
      this.setAttribute("data-status", status);
      this.innerHTML = `${icon}${content}`;
      this.classList.add("animate");

      this.addEventListener("animationend", this.reset);

      resetToast();
    });
  }

  reset() {
    window.requestAnimationFrame(() => {
      this.classList.remove("animate");
      this.innerHTML = "";
    });
  }
}

customElements.define("toast-element", ToastElement);

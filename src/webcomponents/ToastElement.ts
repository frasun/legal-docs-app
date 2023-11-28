import { ToastStatus } from "@utils/toasts";
import { $toast, resetToast } from "@stores/toast";

const errorIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
  <path fill="currentColor" fill-rule="evenodd"
      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16ZM4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8L4.22 5.28a.75.75 0 0 1 0-1.06Z"
      clip-rule="evenodd" />
  </svg>`;

const successIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <path fill="currentColor"
      d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" />
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
      content = message.join("<br />");
    }

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

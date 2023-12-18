import * as backdrop from "@utils/backdrop";
import screens from "@utils/screens";

class QuestionList extends HTMLElement {
  close: HTMLButtonElement | null;
  isOpen: boolean;

  constructor() {
    super();

    this.close = this.querySelector("button");
    this.isOpen = false;
  }

  connectedCallback() {
    document.body.addEventListener("showQuestionList", () => {
      if (window.innerWidth < screens.lg) {
        this.showQuestionList();
      }
    });

    if (this.close) {
      this.close.addEventListener("click", () => {
        this.hideQuestionList();
      });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth >= screens.lg) {
        if (this.isOpen) {
          this.hideQuestionList();
        }
      }
    });
  }

  showQuestionList() {
    backdrop.addBackdrop(() => {
      this.hideQuestionList();
    });
    this.style.transform = "translateY(-100%)";
    this.isOpen = true;
  }

  hideQuestionList() {
    this.removeAttribute("style");
    backdrop.removeBackdrop();
    this.isOpen = false;
  }
}
customElements.define("question-list", QuestionList);

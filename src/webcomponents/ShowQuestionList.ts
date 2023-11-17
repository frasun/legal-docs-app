class ShowQuestionList extends HTMLElement {
  button: HTMLButtonElement | null;

  constructor() {
    super();

    this.button = this.querySelector("button");
  }

  connectedCallback() {
    if (this.button) {
      this.button.addEventListener("click", () => {
        document.body.dispatchEvent(new CustomEvent("showQuestionList"));
      });
    }
  }
}

customElements.define("show-question-list", ShowQuestionList);

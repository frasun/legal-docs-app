class CheckboxList extends HTMLElement {
  valueInput: HTMLInputElement | null;
  checkboxes: NodeListOf<HTMLInputElement>;
  required: boolean;

  constructor() {
    super();

    this.valueInput = this.querySelector('input[type="hidden"]');
    this.checkboxes = this.querySelectorAll('input[type="checkbox"]');
    this.required = this.hasAttribute("required");
  }

  connectedCallback() {
    for (let checkbox of Array.from(this.checkboxes)) {
      checkbox.addEventListener("change", this.setHiddenValue.bind(this));
    }
  }

  setHiddenValue() {
    let value = [];

    for (let checkbox of Array.from(this.checkboxes)) {
      const { checked } = checkbox;
      const checkboxParent = checkbox.parentElement;

      if (checkboxParent) {
        if (checked) {
          value.push(checkboxParent.dataset.label);
          checkboxParent.setAttribute("data-checked", "");
        } else {
          checkboxParent.removeAttribute("data-checked");
        }
      }
    }

    if (this.valueInput) {
      this.valueInput.value = value.join(",");
    }

    // if (this.required) {
    //   if (!value.length) {
    //     Array.from(this.checkboxes)[0].setAttribute("required", "required");
    //   } else {
    //     for (let checkbox of Array.from(this.checkboxes)) {
    //       checkbox.removeAttribute("required");
    //     }
    //   }
    // }
  }
}
customElements.define("checkbox-list", CheckboxList);

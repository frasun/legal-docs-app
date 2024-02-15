class CheckboxList extends HTMLElement {
  valueInput: HTMLInputElement | null;
  checkboxes: NodeListOf<HTMLInputElement>;

  constructor() {
    super();

    this.valueInput = this.querySelector('input[type="hidden"]');
    this.checkboxes = this.querySelectorAll('input[type="checkbox"]');
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

      if (checked) {
        value.push(checkbox.dataset.label);
      }
    }

    if (this.valueInput) {
      this.valueInput.value = value.join(",");
    }
  }
}
customElements.define("checkbox-list", CheckboxList);

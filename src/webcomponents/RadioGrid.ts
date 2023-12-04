class Radiogrid extends HTMLElement {
  valueInputs: NodeListOf<HTMLInputElement>;
  radios: NodeListOf<HTMLInputElement>;

  constructor() {
    super();

    this.valueInputs = this.querySelectorAll('input[type="hidden"]');
    this.radios = this.querySelectorAll('input[type="radio"]');
  }

  connectedCallback() {
    for (let radio of Array.from(this.radios)) {
      radio.addEventListener("change", this.setHiddenValue.bind(this));
    }
  }

  setHiddenValue() {
    const values = this.getHiddenValue();

    Array.from(this.valueInputs).map((input) => {
      const answer = values[input.id] ? values[input.id] : "";

      input.value = Array.isArray(answer) ? answer.join(",") : answer;
    });
  }

  getHiddenValue() {
    let values: Record<string, string[]> = {};

    for (let { name, value, checked } of Array.from(this.radios)) {
      if (checked) {
        if (!Array.isArray(values[value])) {
          values[value] = [];
        }

        values[value].push(name);
      }
    }

    return values;
  }
}
customElements.define("radio-grid", Radiogrid);

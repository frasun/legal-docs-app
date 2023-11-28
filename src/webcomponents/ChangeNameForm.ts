import { changeDocumentName } from "@api/documents";
import { displayError, displayToast } from "@stores/toast";
import { DOCUMENT_NAME_CHANGED } from "@utils/toasts";

class ChangeNameForm extends HTMLElement {
  input: HTMLInputElement | null;
  hiddenInput: HTMLInputElement | null;
  form: HTMLFormElement | null;
  title: string;
  docId: string;

  constructor() {
    super();

    this.form = this.querySelector("form");
    this.input = this.querySelector("input[type='text']");
    this.hiddenInput = this.querySelector("input[type='hidden']");
    this.title = "";
    this.docId = "";
  }

  connectedCallback() {
    this.addEventListener("change-name", ((event: CustomEvent) => {
      this.title = event.detail.title;
      this.docId = event.detail.docId;

      if (this.input) {
        this.input.value = this.title;
      }

      if (this.hiddenInput) {
        this.hiddenInput.value = this.docId;
      }
    }) as EventListener);

    if (this.form) {
      this.form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(this.form || undefined);
        const newTitle = formData.get("title");

        if (newTitle === this.title || String(newTitle).trim() === "") {
          document.body.dispatchEvent(new CustomEvent("hideModal"));
        } else {
          try {
            await changeDocumentName(
              document.cookie,
              this.docId,
              newTitle as string
            );
            displayToast(DOCUMENT_NAME_CHANGED, true);
          } catch {
            document.body.dispatchEvent(new CustomEvent("hideModal"));
            displayError();
          }
        }
      });
    }
  }
}
customElements.define("change-name-form", ChangeNameForm);

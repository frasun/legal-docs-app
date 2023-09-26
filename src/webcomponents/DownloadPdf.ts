import downloadPdf, { getContentArray } from "@utils/pdf";

class DownloadPdf extends HTMLElement {
  button: HTMLButtonElement | null;
  contentId: string | undefined;

  constructor() {
    super();

    this.button = this.querySelector("button") as HTMLButtonElement;
    this.contentId = this.dataset.contentId;
  }

  connectedCallback() {
    if (this.button && this.contentId) {
      this.button.addEventListener("click", () => {
        const docContent = document.querySelector(`${this.contentId}`);

        if (docContent) {
          downloadPdf(
            getContentArray(docContent),
            docContent.getAttribute("data-title") || ""
          );
        }
      });
    }
  }
}

customElements.define("download-pdf", DownloadPdf);

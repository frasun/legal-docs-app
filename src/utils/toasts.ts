export const DOCUMENT_NAME_CHANGED = "Nazwa dokumentu została zmieniona";
export const ANSWER_UPDATED = "Odpowiedź została zapisana";
export const DRAFT_SAVED = "Szkic dokumentu został zapisany";
export const IDENTITY_UPDATED = "Dane tożsamości zostały zaktualizowane";
export const IDENTITY_SAVED = "Nowa tożsamość została dodana";
export const IDENTITY_REMOVED = "Tożsamość została usunięta";
export const DOCUMENT_SHARED =
  "Dokument zostanie wysłany na podane adresy e-mail";
export const ERROR = "Coś poszło nie tak, spróbuj ponownie później";
export const DRAFT_REMOVED = "Szkic został usunięty";
export const COPY_DOCUMENT = "Kopia dokumentu została utworzona";
export const PASSWORD_RESET = "Hasło zostało zmienione";

export enum ToastStatus {
  default = "default",
  error = "error",
}

export function displayGenericError() {
  const toastElement = document.querySelector("toast-element");

  if (!toastElement) {
    const toast = document.createElement("toast-element");
    toast.dataset.content = ERROR;
    toast.dataset.status = ToastStatus.error;

    document.body.appendChild(toast);
  }
}

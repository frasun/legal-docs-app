export const DOCUMENT_NAME_CHANGED = "Nazwa dokumentu została zmieniona";
export const DOCUMENT_NAME_PARAM = "name-changed";
export const ANSWER_UPDATED_PARAM = "answer-updated";
export const ANSWER_UPDATED = "Odpowiedź została zapisana";
export const DRAFT_SAVED_PARAM = "draft-saved";
export const DRAFT_SAVED = "Szkic dokumentu został zapisany";
export const IDENTITY_UPDATED = "Dane tożsamości zostały zaktualizowane";
export const IDENTITY_SAVED = "Nowa tożsamość została dodana";
export const IDENTITY_SAVED_PARAM = "identity-saved";
export const IDENTITY_REMOVED = "Tożsamość została usunięta";
export const IDENTITY_REMOVED_PARAM = "identity-removed";
export const DOCUMENT_SHARED_PARAM = "document-shared";
export const DOCUMENT_SHARED =
  "Dokument zostanie wysłany na podane adresy e-mail";
export const ERROR = "Coś poszło nie tak, spróbuj ponownie później";
export const ERROR_PARAM = "error";
export const DRAFT_REMOVED_PARAM = "draft-removed";
export const DRAFT_REMOVED = "Szkic został usunięty";
export const COPY_DOCUMENT_PARAM = "copy-document";
export const COPY_DOCUMENT = "Kopia dokumentu została utworzona";

export enum ToastStatus {
  default = "default",
  error = "error",
}

export function displayGenericError() {
  const toast = document.createElement("toast-element");
  toast.dataset.content = ERROR;
  toast.dataset.status = ToastStatus.error;

  document.body.appendChild(toast);
}

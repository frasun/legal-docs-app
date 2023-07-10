const toasts = [
  {
    param: "updt",
    info: "Odpowiedź została zapisana",
  },
  {
    param: "namch",
    info: "Nazwa dokumentu została zmieniona",
  },
  {
    param: "drsvd",
    info: "Szkic dokumentu został zapisany",
  },
];

export default toasts;
export const UPDATED_ANSWER_PARAM = toasts[0].param;
export const DOCUMENT_NAME_CHANGED_PARAM = toasts[1].param;
export const DRAFT_SAVED_PARAM = toasts[2].param;

export const TODAY = "TODAY";
export const TIMEZONE = "Europe/Warsaw";
export const LOCALE = "pl-PL";
export const DATE_FORMAT = "dd.MM.yyyy";

export default function (dateString?) {
  const dateObj = dateString ? new Date(dateString) : new Date();
  const date = dateObj.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return date;
}

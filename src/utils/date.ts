export const TODAY = "TODAY";
export const TIMEZONE = "Europe/Warsaw";
export const LOCALE = "pl-PL";

export default function (dateString?: string) {
  const dateObj = dateString ? new Date(dateString) : new Date();
  const date = dateObj.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return date;
}

export function formatDateTime(datetime: Date) {
  const date = datetime.toLocaleDateString(LOCALE, {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
  });

  const time = datetime.toLocaleTimeString(LOCALE, {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "numeric",
  });

  return `${date}, ${time}`;
}

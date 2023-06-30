import { format, parseISO } from "date-fns";
import { DATE_FORMAT } from "./constants";

export default function (dateString) {
  return format(parseISO(dateString), DATE_FORMAT);
}

export const TIMEZONE = "Europe/Warsaw";
export const LOCALE = "pl-PL";

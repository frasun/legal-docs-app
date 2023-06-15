import { format } from "date-fns";
import { TODAY, DATE_FORMAT } from "./constants";

export default function (seed) {
  for (let [key, value] of Object.entries(seed)) {
    if (value === TODAY) {
      seed[key] = format(new Date(), DATE_FORMAT);
    }
  }
  return seed;
}

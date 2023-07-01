import { TODAY } from "./date";

export default function (seed) {
  for (let [key, value] of Object.entries(seed)) {
    if (value === TODAY) {
      seed[key] = new Date();
    }
  }
  return seed;
}

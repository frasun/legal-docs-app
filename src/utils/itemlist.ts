import n2words from "node_modules/n2words/lib/i18n/pl.js";

export function getItem(
  number: number,
  plural: Function,
  female: boolean = false
) {
  if (!number) {
    return "";
  } else if (number === 1) {
    return plural(1);
  } else {
    if (female) {
      if (number === 2) {
        return `dwie ${plural(number)}`;
      } else if (String(number).endsWith("12")) {
        return `${n2words(number)} ${plural(number)}`;
      } else if (String(number).endsWith("2")) {
        return `${n2words(number - 2)} dwie ${plural(number)}`;
      }
    }

    return `${n2words(number)} ${plural(number)}`;
  }
}

export default function (items: [number, Function, boolean?][]) {
  let list = "";

  for (let i = 0; i < items.length; i++) {
    const [number, name, female] = items[i];

    if (number) {
      if (i > 0) {
        list += `, `;
      }
      list += getItem(number, name, female);
    }
  }

  return list;
}

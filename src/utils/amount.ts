import formatNumber from "@utils/number";
import { amountToText } from "amount-to-text";

export default function (number: number) {
  return `${formatNumber(number)} zł (${amountToText(number)})`;
}

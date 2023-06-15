export default function (number) {
  const options =
    number % 1 == 0
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2 };

  return new Intl.NumberFormat("pl-PL", options).format(number);
}

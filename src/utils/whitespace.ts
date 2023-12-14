export default function (string: string) {
  return string.replace(/\s+/g, " ").trim();
}

export function trimString(string: string) {
  return string.replace(/\s+/g, "").trim();
}

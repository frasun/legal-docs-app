export default function (filepath) {
  return filepath.split("/").pop().replace(".mdx", "");
}

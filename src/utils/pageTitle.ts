const siteTitle = "Prawniczek";

export default function (pageTitle = "") {
  return pageTitle ? `${pageTitle} - ${siteTitle}` : siteTitle;
}

export function scrollToElement(elementId = null, offset = 0) {
  const element = document.getElementById(elementId);
  const cords = element ? element.getBoundingClientRect() : null;

  if (cords) {
    window.scrollTo({
      top: window.scrollY + cords.top - offset,
      behavior: "smooth",
    });
  }
}

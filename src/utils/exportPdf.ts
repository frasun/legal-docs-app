import { PDFDocument, rgb, PageSizes, PDFFont } from "@cantoo/pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export const CONTENT_TYPES = {
  TITLE: "title",
  PARAGRAPH: "paragraph",
  POINT: "point",
  LINE: "line",
};

const FONT_SIZE = 11;
const TITLE_FONT_SIZE = 14;
const LINE_HEIGHT = 1.75;
const PARAGRAPH_SPACING = 18;
const POINT_SPACING = 8;
const MARGIN = 50;
const TEXT_INDENT = 20;
const PARGRAPH_PREFIX = "\u00A7";
const COLOR = rgb(0, 0, 0);
const CHIVO_REGULAR = "/chivo-v18-latin_latin-ext-regular.ttf";
const CHIVO_BOLD = "/chivo-v18-latin_latin-ext-700.ttf";

export default async function (
  paragraphs: (string | null)[][],
  documentTitle = "document"
) {
  const FONT_REGULAR = await fetch(CHIVO_REGULAR).then((res) =>
    res.arrayBuffer()
  );
  const FONT_BOLD = await fetch(CHIVO_BOLD).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontRegular = await pdfDoc.embedFont(FONT_REGULAR);
  const fontBold = await pdfDoc.embedFont(FONT_BOLD);

  let page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const startY = height - MARGIN;

  let currentY = startY;
  let paragraphIndex = 0;
  let pointIndex = 0;

  for (let p = 0; p < paragraphs.length; p++) {
    const [contentType, content] = paragraphs[p];
    const isTitle = contentType === CONTENT_TYPES.TITLE;
    const isParagraph = contentType === CONTENT_TYPES.PARAGRAPH;
    const isPoint = contentType === CONTENT_TYPES.POINT;
    const isLine = contentType === CONTENT_TYPES.LINE;

    const font = isParagraph ? fontBold : fontRegular;
    const size = isTitle ? TITLE_FONT_SIZE : FONT_SIZE;
    const indent = isTitle ? 0 : TEXT_INDENT;
    const lineHeight = font.sizeAtHeight(size) * LINE_HEIGHT;
    const prefix = isParagraph ? PARGRAPH_PREFIX : "";
    const spacing = isLine
      ? 0
      : isParagraph
      ? PARAGRAPH_SPACING
      : POINT_SPACING;
    const color = COLOR;

    let index;

    if (isParagraph) {
      index = paragraphIndex + 1;
      paragraphIndex++;
      pointIndex = 0;
    } else if (isPoint) {
      index = pointIndex + 1;
      pointIndex++;
    }

    const lines = splitIntoLines(
      content as string,
      font,
      size,
      width - MARGIN * 2 - indent
    );

    currentY -= spacing;

    if (currentY < MARGIN) {
      page = pdfDoc.addPage(PageSizes.A4);
      currentY = height - MARGIN;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isFirstLine = i === 0;

      let linePrefix = "";
      if (isFirstLine && index) {
        linePrefix = `${prefix}${index}. `;
        page.drawText(linePrefix, {
          x: MARGIN,
          y: currentY,
          size,
          font,
          color,
        });
      }

      const contentX = MARGIN + indent;
      const contentY = currentY;

      page.drawText(line, {
        x: contentX,
        y: contentY,
        size,
        font,
        color,
      });

      currentY -= lineHeight;

      if (currentY < MARGIN && i < lines.length) {
        page = pdfDoc.addPage(PageSizes.A4);
        currentY = height - MARGIN;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();

  downloadFile(pdfBytes, documentTitle);
}

function splitIntoLines(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const currentLineWithWord = currentLine + " " + word;
    const width = font.widthOfTextAtSize(currentLineWithWord, fontSize);

    if (width <= maxWidth) {
      currentLine = currentLineWithWord;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  lines.push(currentLine);

  return lines;
}

function downloadFile(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = document.createElement("a");

  link.href = window.URL.createObjectURL(blob);
  link.download = `${generateSafeFileName(filename)}.pdf`;
  link.click();
}

function generateSafeFileName(inputString: string) {
  const invalidCharsRegex = /[\\/:"*?<>|]/g;
  const safeString = inputString.replace(invalidCharsRegex, "");
  const trimmedString = safeString.trim().substring(0, 100);
  const safeFileName = trimmedString.replace(/\s+/g, "_");

  return safeFileName.toLowerCase();
}

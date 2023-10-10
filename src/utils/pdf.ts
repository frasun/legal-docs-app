import { PDFDocument, rgb, PageSizes, PDFFont, PDFPage } from "@cantoo/pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import trimWhitespace from "@utils/whitespace";

export const DEFAULT_TITLE = "dokument";

enum CONTENT_TYPES {
  TITLE = "title",
  SECTION = "section",
  PARAGRAPH = "paragraph",
  POINT = "point",
  LINE = "line",
  SIGNATURE = "signature",
}

type DocumentContent = [CONTENT_TYPES, string];

const FONT_SIZE = 11;
const TITLE_FONT_SIZE = 13;
const SIGNATURE_FONT_SIZE = 9;
const LINE_HEIGHT = 1.75;
const SECTION_SPACING = 18;
const POINT_SPACING = 3;
const MARGIN = 50;
const POINT_INDENT = 32;
const PARGRAPH_PREFIX = "\u00A7";
const COLOR = rgb(0, 0, 0);
const CHIVO_REGULAR = "/Chivo-Regular.ttf";
const CHIVO_BOLD = "/Chivo-Bold.ttf";

export default async function (
  paragraphs: DocumentContent[],
  documentTitle = DEFAULT_TITLE
) {
  const pdfBytes = await createPDF(paragraphs);
  downloadFile(pdfBytes, documentTitle);
}

export async function createPDF(
  paragraphs: DocumentContent[],
  urlOrigin: string = ""
) {
  const FONT_REGULAR = await fetch(`${urlOrigin}${CHIVO_REGULAR}`).then((res) =>
    res.arrayBuffer()
  );
  const FONT_BOLD = await fetch(`${urlOrigin}${CHIVO_BOLD}`).then((res) =>
    res.arrayBuffer()
  );

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontRegular = await pdfDoc.embedFont(FONT_REGULAR);
  const fontBold = await pdfDoc.embedFont(FONT_BOLD);

  let page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const startY = height - MARGIN;

  let contentParagrpahs: DocumentContent[] = [];
  let signatures: string[] = [];
  for (let [type, content] of paragraphs) {
    if (type === CONTENT_TYPES.SIGNATURE) {
      signatures.push(content);
    } else {
      contentParagrpahs.push([type, content]);
    }
  }

  let currentY = startY;
  let paragraphIndex = 0;
  let pointIndex = 0;

  for (let paragraph of contentParagrpahs) {
    const [contentType, content] = paragraph;
    const isSection = contentType === CONTENT_TYPES.SECTION;
    const isPoint = contentType === CONTENT_TYPES.POINT;

    const font = getFont(contentType, fontRegular, fontBold);
    const size = getSize(contentType);
    const indent = getIndent(contentType);
    const spacing = getSpacing(contentType);
    const lineHeight = font.sizeAtHeight(size) * LINE_HEIGHT;

    if (isSection) {
      paragraphIndex++;
      pointIndex = 0;
    } else if (isPoint) {
      pointIndex++;
    }

    currentY -= spacing;

    if (currentY < MARGIN) {
      page = pdfDoc.addPage(PageSizes.A4);
      currentY = height - MARGIN;
    }

    const lines = splitIntoLines(
      content as string,
      font,
      size,
      width - MARGIN * 2 - indent
    );

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const isFirstLine = i === 0;

      if (isFirstLine) {
        if (isPoint) {
          const linePrefix = `${pointIndex}. `;
          printText(page, linePrefix, MARGIN + 10, currentY, size, font);
        } else if (isSection) {
          line = `${PARGRAPH_PREFIX}${paragraphIndex}. ${line}`;
        }
      }

      printText(page, line, MARGIN + indent, currentY, size, font);

      currentY -= lineHeight;

      if (currentY < MARGIN && i < lines.length) {
        page = pdfDoc.addPage(PageSizes.A4);
        currentY = height - MARGIN;
      }
    }
  }

  if (signatures) {
    let signaturesLineLength = 0;
    let signaturesHeight = 0;
    const signatureLH = fontRegular.sizeAtHeight(9) * LINE_HEIGHT;
    const signatureSpacing = 50;

    for (const signature of signatures) {
      const lines = splitIntoLines(
        signature,
        fontRegular,
        9,
        width - MARGIN * 2
      );

      signaturesLineLength += lines.length;
      signaturesHeight += signaturesLineLength * signatureLH + signatureSpacing;
    }

    if (currentY - signaturesHeight < MARGIN) {
      page = pdfDoc.addPage(PageSizes.A4);
      currentY = height - MARGIN;
    }

    for (const signature of signatures) {
      const lines = splitIntoLines(
        signature,
        fontRegular,
        9,
        width / 2 - MARGIN * 2
      );

      currentY -= signatureSpacing;

      for (const line of lines) {
        console.log(line, MARGIN, currentY);
        printText(page, line, MARGIN, currentY, 9, fontRegular);
        currentY -= signatureLH;
      }
    }
  }

  return await pdfDoc.save();
}

function getFont(
  block: CONTENT_TYPES,
  fontRegular: PDFFont,
  fontBold: PDFFont
) {
  switch (block) {
    case CONTENT_TYPES.SECTION:
    case CONTENT_TYPES.TITLE:
      return fontBold;
    default:
      return fontRegular;
  }
}

function getSize(block: CONTENT_TYPES) {
  switch (block) {
    case CONTENT_TYPES.TITLE:
      return TITLE_FONT_SIZE;
    case CONTENT_TYPES.SIGNATURE:
      return SIGNATURE_FONT_SIZE;
    default:
      return FONT_SIZE;
  }
}

function getIndent(block: CONTENT_TYPES) {
  switch (block) {
    case CONTENT_TYPES.POINT:
      return POINT_INDENT;
    default:
      return 0;
  }
}

function getSpacing(block: CONTENT_TYPES) {
  switch (block) {
    case CONTENT_TYPES.POINT:
      return POINT_SPACING;
    case CONTENT_TYPES.SECTION:
      return SECTION_SPACING;
    default:
      return 0;
  }
}

function printText(
  page: PDFPage,
  content: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color = COLOR
) {
  page.drawText(content, {
    x,
    y,
    size,
    font,
    color,
  });
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

export function generateSafeFileName(inputString: string) {
  const invalidCharsRegex = /[\\/:"*?<>|]/g;
  const safeString = inputString.replace(invalidCharsRegex, "");
  const trimmedString = safeString.trim().substring(0, 100);
  const safeFileName = trimmedString.replace(/\s+/g, "_");

  return safeFileName.toLowerCase();
}

export function getContentArray(element: Element) {
  let array: DocumentContent[] = [];

  for (let i = 0; i < element.children.length; i++) {
    const el = element.children[i];

    switch (el.tagName) {
      case "H3":
        if (el.textContent) {
          array.push([CONTENT_TYPES.TITLE, el.textContent]);
        }
        break;
      case "H4":
        if (el.textContent) {
          array.push([CONTENT_TYPES.SECTION, el.textContent]);
        }
        break;
      case "OL":
        array.push(...getListItems(el));
        break;
      case "P":
        array.push(...getPargraph(el.innerHTML));
        break;
      case "FOOTER":
        array.push([
          CONTENT_TYPES.SIGNATURE,
          trimWhitespace(el.textContent as string),
        ]);
        break;
    }
  }

  return array;
}

function getListItems(list: Element) {
  let array: DocumentContent[] = [];
  const lineBreakRegex = /<\s*br\s*\/?>/gi;

  for (let i = 0; i < list.children.length; i++) {
    const lines = list.children[i].innerHTML.split(lineBreakRegex);

    for (const line of lines) {
      array.push([CONTENT_TYPES.POINT, cleanContent(line)]);
    }
  }

  return array;
}

function getPargraph(paragraph: string | null) {
  let array: DocumentContent[] = [];
  const lineBreakRegex = /<\s*br\s*\/?>/gi;

  if (paragraph) {
    const lines = paragraph.split(lineBreakRegex);

    for (const line of lines) {
      if (line.startsWith("\n")) {
        array.push([CONTENT_TYPES.PARAGRAPH, cleanContent(line)]);
      } else {
        array.push([CONTENT_TYPES.LINE, cleanContent(line)]);
      }
    }
  }

  return array;
}

function cleanContent(line: string) {
  return line
    .replace("\n", "")
    .trim()
    .replace(/<[^>]+>/g, "");
}

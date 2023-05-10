export default function (content, title) {
  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8' />
            <title>${title}</title>
        </head>
        <body>
        ${content}
        </body>
        </html>`;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  const url = `data:application/vnd.ms-word;charset=utf-8,${encodeURIComponent(
    html
  )}`;
  const fileName = `${title}.docx`;

  const downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();

  document.body.removeChild(downloadLink);
}

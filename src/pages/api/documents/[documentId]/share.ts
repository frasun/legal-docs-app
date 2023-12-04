import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { WRONG_EMAIL_FORMAT } from "@utils/response";
import { isEmail } from "@utils/validation";
import { createPDF, generateSafeFileName } from "@utils/pdf";
import { shareDocument } from "@db/document";
import { responseHeaders as headers, parseError } from "@api/helpers/response";

export const post: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 401 });
    }

    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const { pdf, emails, sendToMe, title, template } = await request.json();
    const { documentId } = params;
    const url = new URL(request.url);

    let emailList: string[] = emails;

    if (Boolean(sendToMe)) {
      emailList.push(session.user?.email as string);
    }

    for (let email of emailList) {
      if (!isEmail(email)) {
        throw new Error(`${WRONG_EMAIL_FORMAT}: ${email}`, { cause: 400 });
      }
    }

    if (pdf && emailList.length && title && template) {
      const pdfDoc = await createPDF(pdf, url.origin);
      const pdfBase64 = Buffer.from(pdfDoc).toString("base64");

      const response = await shareDocument(
        pdfBase64,
        generateSafeFileName(title),
        emailList,
        template,
        session.user?.email as string,
        documentId as string,
        session.user?.id as string
      );

      if (response === null) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    } else {
      throw new Error(undefined, { cause: 400 });
    }
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

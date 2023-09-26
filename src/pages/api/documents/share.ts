import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { UNAUTHORIZED, WRONG_EMAIL_FORMAT } from "@utils/response";
import { emailRegExp, testString } from "@utils/dataValidation";
import { createPDF, generateSafeFileName } from "@utils/pdf";
import { shareDocument } from "@db/document";
import { UUID } from "mongodb";

export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const session = await getSession(request);

    if (!session) {
      return new Response(null, { status: 401, statusText: UNAUTHORIZED });
    }

    const { pdf, emails, sendToMe, documentId, title, template } =
      await request.json();
    const url = new URL(request.url);

    if (!UUID.isValid(documentId)) {
      return new Response(null, { status: 400 });
    }

    let emailList: string[] = emails;

    if (Boolean(sendToMe)) {
      emailList.push(session.user?.email as string);
    }

    for (let email of emailList) {
      const isEmail = testString(email, emailRegExp);

      if (!isEmail) {
        return new Response(`${WRONG_EMAIL_FORMAT}: ${email}`, { status: 400 });
      }
    }

    if (pdf && emailList.length && title && template) {
      try {
        const pdfDoc = await createPDF(pdf, url.origin);
        const pdfBase64 = Buffer.from(pdfDoc).toString("base64");

        await shareDocument(
          pdfBase64,
          generateSafeFileName(title),
          emailList,
          template,
          session.user?.email as string,
          documentId,
          session.user?.id as string
        );
      } catch (e) {
        return new Response(e instanceof Error ? e.message : null, {
          status: 500,
        });
      }
    } else {
      return new Response(null, { status: 400 });
    }

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(null, { status: 400 });
  }
};

import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { WRONG_EMAIL_FORMAT } from "@utils/response";
import { emailRegExp, testString } from "@utils/dataValidation";
import { createPDF, generateSafeFileName } from "@utils/pdf";
import { shareDocument } from "@db/document";
import { responseHeaders as headers } from "@api/helpers/response";

export const post: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  if (request.headers.get("Content-Type") === "application/json") {
    const { pdf, emails, sendToMe, title, template } = await request.json();
    const { documentId } = params;
    const url = new URL(request.url);

    let emailList: string[] = emails;

    if (Boolean(sendToMe)) {
      emailList.push(session.user?.email as string);
    }

    for (let email of emailList) {
      const isEmail = testString(email, emailRegExp);

      if (!isEmail) {
        return new Response(`${WRONG_EMAIL_FORMAT}: ${email}`, {
          status: 400,
          headers,
        });
      }
    }

    if (pdf && emailList.length && title && template) {
      try {
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
          return new Response(JSON.stringify(null), { status: 404, headers });
        }

        return new Response(JSON.stringify(null), { status: 200, headers });
      } catch (e) {
        return new Response(
          JSON.stringify(e instanceof Error ? e.message : null),
          {
            status: 500,
            headers,
          }
        );
      }
    } else {
      return new Response(JSON.stringify(null), { status: 400, headers });
    }
  } else {
    return new Response(JSON.stringify(null), { status: 400, headers });
  }
};

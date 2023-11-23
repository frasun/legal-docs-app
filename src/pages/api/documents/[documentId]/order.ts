import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import CookieUtil from "cookie";
import { getSession } from "auth-astro/server";
import { SESSION_COOKIE } from "@utils/cookies";
import { getEntry } from "astro:content";
import { nanoid } from "nanoid";
import { createPaymentSession } from "@db/session";
import { createCheckoutSession } from "@utils/stripe";
import { UUID } from "mongodb";
import { getDocumentSummary } from "@db/document";
import routes from "@utils/routes";
import * as PARAMS from "@utils/urlParams";

export const post: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 401 });
    }

    const { documentId } = params as { documentId: string };
    const { anonymousEmail } = await request.json();

    const cookie = request.headers.get("cookie");
    const cookies = CookieUtil.parse(cookie || "");
    const isUserDocument = UUID.isValid(documentId);
    const session = await getSession(request);
    const ssid = session ? session.user?.ssid : cookies[SESSION_COOKIE];

    let doc: string | null = null,
      draft: boolean;

    if (!ssid) {
      throw new Error(undefined, { cause: 404 });
    }

    if (isUserDocument) {
      if (!session) {
        throw new Error(undefined, { cause: 403 });
      }

      const userId = session?.user?.id as string;

      ({ doc, draft } = await getDocumentSummary(documentId, userId));

      if (!draft) {
        throw new Error(undefined, { cause: 303 });
      }
    }

    const template = await getEntry("documents", doc ?? (documentId as string));

    if (!template) {
      throw new Error(undefined, { cause: 404 });
    }

    const { priceId } = template.data;
    const pid = nanoid();
    const baseUrl = new URL(request.url).origin;

    const successUrl = new URL(routes.DOCUMENT, request.url);

    successUrl.searchParams.append(PARAMS.PAYMENT, pid);
    successUrl.searchParams.append(PARAMS.DRAFT, "false");

    if (anonymousEmail) {
      successUrl.searchParams.append(
        PARAMS.EMAIL,
        encodeURIComponent(anonymousEmail)
      );
    }
    const draftUrl = `${baseUrl}${routes.DOCUMENT}?${PARAMS.DOCUMENT}=${documentId}&${PARAMS.DRAFT}=true`;
    const referUrl = `${baseUrl}${routes.DOCUMENTS}/${documentId}${routes.SUMMARY}`;
    const cancelUrl = anonymousEmail
      ? baseUrl
      : isUserDocument
      ? referUrl
      : draftUrl;

    const customerEmail = session
      ? (session.user?.email as string)
      : anonymousEmail;

    await createPaymentSession(pid, ssid, documentId);

    const url = await createCheckoutSession(
      priceId,
      successUrl.toString(),
      cancelUrl.toString(),
      customerEmail
    );

    return new Response(JSON.stringify(url), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);

    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

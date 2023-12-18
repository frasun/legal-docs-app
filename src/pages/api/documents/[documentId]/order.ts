import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import CookieUtil from "cookie";
import { getSession } from "auth-astro/server";
import { SESSION_COOKIE } from "@utils/cookies";
import { nanoid } from "nanoid";
import { createPaymentSession } from "@db/session";
import { createCheckoutSession } from "@utils/stripe";
import { UUID } from "mongodb";
import { getDocumentSummary } from "@db/document";
import routes from "@utils/routes";
import * as PARAMS from "@utils/urlParams";
import { UserRoles } from "@db/user";
import { getDocumentPrice } from "@api/helpers/templates";

export const POST: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { documentId } = params as { documentId: string };
    const { anonymousEmail } = await request.json();

    const cookie = request.headers.get("cookie");
    const cookies = CookieUtil.parse(cookie || "");
    const isUserDocument = UUID.isValid(documentId);
    const session = await getSession(request);
    const isAdmin = session?.user?.role === UserRoles.admin;
    const ssid = session ? session.user?.ssid : cookies[SESSION_COOKIE];

    let doc: string | null = null,
      draft: boolean;

    if (!ssid) {
      throw new Error(undefined, { cause: 404 });
    }

    if (isAdmin) {
      const url = `${routes.DOCUMENT}?${PARAMS.DOCUMENT}=${documentId}&${PARAMS.DRAFT}=false`;
      return new Response(JSON.stringify(url), { status: 200, headers });
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

    const { priceId } = await getDocumentPrice(doc ?? (documentId as string));
    const pid = nanoid();
    const baseUrl = new URL(request.url).origin;

    const successUrl = new URL(routes.DOCUMENT, request.url);

    successUrl.searchParams.append(PARAMS.PAYMENT, pid);
    successUrl.searchParams.append(PARAMS.DRAFT, "false");

    if (anonymousEmail) {
      successUrl.searchParams.append(PARAMS.EMAIL, anonymousEmail);
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

    const { url, id } = await createCheckoutSession(
      priceId,
      successUrl.toString(),
      cancelUrl.toString(),
      customerEmail
    );

    await createPaymentSession(pid, ssid, documentId, id);

    return new Response(JSON.stringify(url), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);

    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

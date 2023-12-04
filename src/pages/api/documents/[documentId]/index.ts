import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft, changeDocumentName, updateAnswers } from "@db/document";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getDocumentTemplate } from "@api/documents";
import { getTemplate } from "@api/templates";
import { z } from "astro:content";
import { UUID } from "mongodb";
import { storeAnswers } from "@db/session";
import CookieUtil from "cookie";
import { SESSION_COOKIE } from "@utils/cookies";

export const all: APIRoute = async ({ params, request }) => {
  try {
    const { documentId } = params as { documentId: string };
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const userId = session.user?.id;

    if (request.method === "DELETE") {
      const response = await deleteDraft(
        documentId as string,
        userId as string
      );

      if (!response.deletedCount) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    }

    if (request.method === "PATCH") {
      const name = await request.text();

      const response = await changeDocumentName(
        documentId as string,
        userId as string,
        name
      );

      if (!response.modifiedCount) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    }

    throw new Error(undefined, { cause: 400 });
  } catch (e) {
    const { message, status } = parseError(e);

    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

export const put: APIRoute = async ({ request, params }) => {
  try {
    const session = await getSession(request);

    const { documentId } = params as {
      documentId: string;
    };

    const cookie = request.headers.get("cookie");
    const isUserDocument = UUID.isValid(documentId);
    const answers = await request.json();

    if (isUserDocument) {
      if (!session) {
        throw new Error(undefined, { cause: 403 });
      }

      const { doc: docId } = await getDocumentTemplate(cookie, documentId);
      const { encryptedFields } = await getTemplate(cookie, docId);
      const userId = session.user?.id as string;

      const response = await updateAnswers(
        documentId,
        userId,
        answers,
        docId,
        encryptedFields
      );

      if (response.modifiedCount > 0) {
        return new Response(JSON.stringify(response.modifiedCount), {
          status: 200,
          headers,
        });
      } else throw new Error(undefined, { cause: 400 });
    }

    const cookies = CookieUtil.parse(cookie || "");
    const ssid = session ? session.user?.ssid : cookies[SESSION_COOKIE];

    if (ssid) {
      await storeAnswers(ssid, documentId, answers);
    }

    return new Response(JSON.stringify(null), {
      status: 200,
      headers,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.map(({ message, path }) => [
        message,
        path[path.length - 1],
      ]);

      return new Response(JSON.stringify(errors), {
        status: 400,
        headers,
      });
    }

    const { message, status } = parseError(e);

    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft, changeDocumentName, updateAnswers } from "@db/document";
import { responseHeaders as headers } from "@api/helpers/response";
import { getDocumentTemplate } from "@api/documents";
import { getTemplate } from "@api/templates";
import { z } from "astro:content";
import { UUID } from "mongodb";
import { storeAnswers } from "@db/session";
import CookieUtil from "cookie";
import { SESSION_COOKIE } from "@utils/cookies";

export const all: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { documentId } = params;
  const userId = session.user?.id;

  if (request.method === "DELETE") {
    try {
      const response = await deleteDraft(
        documentId as string,
        userId as string
      );

      if (response.deletedCount === 1) {
        return new Response(JSON.stringify(null), { status: 200, headers });
      }

      return new Response(JSON.stringify(null), { status: 404, headers });
    } catch (e) {
      return new Response(
        JSON.stringify(e instanceof Error ? e.message : null),
        {
          status: 500,
          headers,
        }
      );
    }
  }

  if (request.method === "PATCH") {
    try {
      const name = await request.text();

      const response = await changeDocumentName(
        documentId as string,
        userId as string,
        name
      );

      if (response.modifiedCount === 0) {
        return new Response(JSON.stringify(null), { status: 404, headers });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    } catch (e) {
      return new Response(
        JSON.stringify(e instanceof Error ? e.message : null),
        {
          status: 400,
          headers,
        }
      );
    }
  }

  return new Response(JSON.stringify(null), {
    status: 400,
    headers,
  });
};

export const post: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 403, headers });
  }

  const { documentId } = params as {
    documentId: string;
  };

  const cookie = request.headers.get("cookie");
  const userId = session.user?.id as string;
  const isUserDocument = UUID.isValid(documentId);

  try {
    const answers = await request.json();

    if (isUserDocument) {
      const { doc: docId } = await getDocumentTemplate(cookie, documentId);
      const { encryptedFields } = await getTemplate(cookie, docId);

      const response = await updateAnswers(
        documentId,
        userId,
        answers,
        docId,
        encryptedFields
      );

      if (response.modifiedCount > 0) {
        return new Response(JSON.stringify(null), {
          status: 200,
          headers,
        });
      } else
        return new Response(JSON.stringify(null), { status: 400, headers });
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
      const errors = e.errors.map(({ message }) => message);

      return new Response(JSON.stringify(errors), {
        status: 400,
        headers,
      });
    }

    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { PAGE } from "@utils/urlParams";
import { getUserDocuments } from "@api/helpers/documents";
import { createDocument, publishDraft } from "@db/document";
import { UUID } from "mongodb";
import { z } from "astro:content";
import { getTemplateSummary } from "@api/templates";

export const get: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const userId = session.user?.id as string;
  const url = new URL(request.url);
  const pageParam = url.searchParams.get(PAGE);
  const page = pageParam ? Number(pageParam) : 1;

  try {
    const documents = await getUserDocuments(userId, page);

    return new Response(JSON.stringify(documents), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

export const post: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { documentId, draft, userEmail } = (await request.json()) as {
      documentId: string;
      draft: boolean;
      userEmail?: string;
    };

    const cookie = request.headers.get("cookie");
    const isUserDocument = UUID.isValid(documentId);
    const session = await getSession(request);
    let modifiedId: UUID | null = null;

    if (!session && !userEmail) {
      throw new Error(undefined, { cause: 401 });
    }

    const { answers, canGenerate } = await getTemplateSummary(
      cookie,
      documentId
    );

    if (canGenerate || (draft && !userEmail)) {
      if (isUserDocument) {
        // publish draft
        if (!session) {
          throw new Error(undefined, { cause: 401 });
        }

        modifiedId = await publishDraft(
          documentId,
          session?.user?.id as string
        );
      } else {
        // create document
        const userId = userEmail || session?.user?.id;

        if (userId) {
          modifiedId = await createDocument(documentId, answers, userId, draft);
        }
      }
    } else {
      throw new Error(undefined, { cause: 403 });
    }

    return new Response(JSON.stringify(modifiedId), {
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

    if (e instanceof Error) {
      const status =
        e.cause &&
        Number(e.cause) &&
        Number(e.cause) > 200 &&
        Number(e.cause) < 599;

      return new Response(JSON.stringify(e.message || null), {
        status: status ? Number(e.cause) : 500,
        headers,
      });
    }

    return new Response(JSON.stringify(null), {
      status: 500,
      headers,
    });
  }
};

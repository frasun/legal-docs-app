import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft, changeDocumentName } from "@db/document";
import { getPrice } from "@utils/stripe";
import { getDocumentPosts } from "@api/helpers/posts";
import { getDocumentInfo } from "@api/helpers/documents";
import { responseHeaders as headers } from "@api/helpers/response";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const { documentId } = params;
  const session = await getSession(request);
  const showMemberContent = Boolean(session);
  const showDarft = session?.user?.role === UserRoles.admin;

  try {
    const [info, document] = await Promise.all([
      getDocumentPosts(documentId as string, showMemberContent),
      getDocumentInfo(documentId as string),
    ]);

    if (!info || !document) {
      return new Response(null, {
        status: 404,
      });
    }

    const { title, body, draft, memberContent, keywords, description, posts } =
      info;
    const { index, priceId } = document.data;

    if ((draft && !showDarft) || !index) {
      return new Response(null, {
        status: 404,
      });
    }

    if (memberContent && !showMemberContent) {
      return new Response(null, {
        status: 403,
      });
    }

    return new Response(
      JSON.stringify({
        title,
        keywords,
        description,
        price: await getPrice(priceId),
        firstQuestionUrl: `/dokumenty/${documentId}/${index[0].questions[0].id.slug}`,
        body,
        posts,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, {
      status: 500,
    });
  }
};

export const all: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
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

      return new Response(null, { status: 404 });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : null, {
        status: 500,
      });
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
        return new Response(null, { status: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : null, {
        status: 400,
      });
    }
  }

  return new Response(null, {
    status: 400,
  });
};

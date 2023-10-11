import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft } from "@db/document";
import { UserRoles } from "@db/user";
import stripe from "@utils/stripe";
import { getDocumentPosts } from "@utils/posts";
import { getDocumentInfo } from "@utils/documents";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const { documentId } = params;

  if (!documentId) {
    return new Response(null, {
      status: 400,
    });
  }

  const session = await getSession(request);
  const isAdmin = session?.user?.role === UserRoles.admin;

  try {
    const [info, document] = await Promise.all([
      getDocumentPosts(documentId, session),
      getDocumentInfo(documentId),
    ]);

    if (!info || !document) {
      return new Response(null, {
        status: 404,
      });
    }

    const { title, body, draft, memberContent, keywords, description, posts } =
      info;
    const { index, priceId } = document.data;

    if ((draft && (!session || !isAdmin)) || !index) {
      return new Response(null, {
        status: 404,
      });
    }

    if (memberContent && !session) {
      return new Response(null, {
        status: 401,
      });
    }

    const { unit_amount } = await stripe.prices.retrieve(priceId);

    return new Response(
      JSON.stringify({
        title,
        keywords,
        description,
        price: unit_amount ? unit_amount / 100 : null,
        firstQuestionUrl: `/dokumenty/${documentId}/${index[0].questions[0].id.slug}`,
        body,
        posts,
      }),
      {
        status: 200,
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

  if (request.method === "DELETE") {
    const { documentId } = params;
    const userId = session.user?.id;

    try {
      await deleteDraft(documentId as string, userId as string);

      return new Response(null, {
        status: 200,
      });
    } catch (e) {
      return new Response(e instanceof Error ? e.message : null, {
        status: 500,
      });
    }
  }

  return new Response(null, {
    status: 400,
  });
};

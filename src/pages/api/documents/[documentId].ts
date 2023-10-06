import { UNAUTHORIZED } from "@utils/response";
import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { deleteDraft } from "@db/document";
import { UserRoles } from "@db/user";
//@ts-ignore
import { sanityClient } from "sanity:client";
import { getEntry } from "astro:content";
import Stripe from "stripe";
import type { Document } from "@type";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const { documentId } = params;
  const session = await getSession(request);
  const isAdmin = session?.user?.role === UserRoles.admin;

  const allPostQuery = `_type=='post' && references(^._id) && defined(publishedAt)`;
  const postQuery = session
    ? allPostQuery
    : `${allPostQuery} && (memberContent == false || !defined(memberContent))`;

  const info: Document = await sanityClient.fetch(
    `*[_type == 'legalDocument' && slug.current == "${documentId}"] { 
      title, 
      "draft": !publishedAt, 
      body,
      memberContent,
      keywords,
      description,
      "posts": *[${postQuery}] | order(publishedAt desc) [0..2] { 
        title, 
        mainImage, 
        publishedAt,
        slug,
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
      }
  }[0]`
  );

  if (!info) {
    return new Response(null, {
      status: 404,
    });
  }

  const { title, body, draft, memberContent, keywords, description, posts } =
    info;

  if (draft) {
    if (!session || isAdmin) {
      return new Response(null, {
        status: 404,
      });
    }
  }

  const document = await getEntry("documents", documentId as string);

  if (!document) {
    return new Response(null, {
      status: 404,
    });
  }

  const { index, priceId } = document.data;

  if (!index) {
    return new Response(null, {
      status: 404,
    });
  }

  if (memberContent && !session) {
    return new Response(null, {
      status: 401,
    });
  }

  const stripe = new Stripe(import.meta.env.STRIPE_API_KEY, {
    apiVersion: import.meta.env.STRIPE_API_V,
  });

  const documentPrice = await stripe.prices.retrieve(priceId);
  const price = documentPrice.unit_amount ? documentPrice.unit_amount / 100 : 0;

  const firstQuestionUrl = `/dokumenty/${documentId}/${index[0].questions[0].id.slug}`;

  const response = {
    title,
    keywords,
    description,
    price,
    firstQuestionUrl,
    body,
    posts,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
  });
};

export const all: APIRoute = async ({ params, request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401, statusText: UNAUTHORIZED });
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

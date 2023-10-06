import type { APIRoute } from "astro";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Page } from "@type";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  try {
    const page: Page = await sanityClient.fetch(
      `*[_type == "page" && _id == $id] {
          title,
          body, 
        }[0]`,
      {
        id: params.pageId,
      }
    );

    if (!page) {
      return new Response(null, { status: 404 });
    }

    return new Response(JSON.stringify(page), {
      status: 200,
    });
  } catch {
    return new Response(null, {
      status: 500,
    });
  }
};

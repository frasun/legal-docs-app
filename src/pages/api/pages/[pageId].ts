import type { APIRoute } from "astro";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Page } from "@type";
import { responseHeaders as headers } from "@api/helpers/response";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(JSON.stringify(null), { status: 401, headers });
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
      return new Response(JSON.stringify(null), { status: 404, headers });
    }

    return new Response(JSON.stringify(page), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(JSON.stringify(null), {
      status: 500,
      headers,
    });
  }
};

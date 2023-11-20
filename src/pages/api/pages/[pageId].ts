import type { APIRoute } from "astro";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Page } from "@type";
import { responseHeaders as headers, parseError } from "@api/helpers/response";

export const get: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

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
      throw new Error(undefined, { cause: 404 });
    }

    return new Response(JSON.stringify(page), {
      status: 200,
      headers,
    });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { parseError } from "@api/helpers/response";
import { verificationInProgress } from "@db/user";

export const get: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    const { email } = params as {
      email: string;
    };

    if (!email) {
      throw new Error(undefined, { cause: 404 });
    }

    const verificationInitialiased = await verificationInProgress(email);

    if (!verificationInitialiased) {
      throw new Error(undefined, { cause: 404 });
    }

    return new Response(JSON.stringify(null), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

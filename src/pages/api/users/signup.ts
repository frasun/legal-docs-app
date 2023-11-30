import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { parseError } from "@api/helpers/response";
import error from "@utils/errors";
import {
  getUserByEmail,
  initAccountVerify,
  verificationInProgress,
} from "@db/user";
import sendEmail from "@utils/email";

export const post: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { tos, email, password } = (await request.json()) as {
      tos: string;
      email: string;
      password: string;
    };

    if (tos !== "on") {
      throw new Error(error.ACCEPT_TERMS, { cause: 400 });
    }

    const user = await getUserByEmail(email);
    const alreadyInitialised = await verificationInProgress(email);

    if (alreadyInitialised || user) {
      throw new Error(error.EMAIL_TAKEN, { cause: 400 });
    }

    const code = await initAccountVerify(email, password);
    await sendEmail(email, { code });

    return new Response(JSON.stringify(null), {
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

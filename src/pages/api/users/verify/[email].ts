import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { parseError } from "@api/helpers/response";
import { verificationInProgress } from "@db/user";
import error from "@utils/errors";
import {
  createUser,
  getVerificationData,
  wrongVerificationCode,
} from "@db/user";

export const GET: APIRoute = async ({ request, params }) => {
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

export const POST: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { email } = params as {
      email: string;
    };

    if (!email) {
      throw new Error(undefined, { cause: 404 });
    }

    const { code: postedCode } = (await request.json()) as {
      code: string;
    };

    const verificationData = await getVerificationData(email);

    if (!verificationData) {
      throw new Error(undefined, { cause: 404 });
    }

    const { code, password, rateLimit } = verificationData;

    if (String(code) === postedCode) {
      await createUser(email, password as string);
    } else {
      await wrongVerificationCode(email, (rateLimit as number) + 1);

      if ((rateLimit as number) === 2) {
        throw new Error(error.VERIFICATION_CODE_EXPIRED, { cause: 400 });
      } else {
        throw new Error(error.WRONG_VERIFICATION_CODE, { cause: 400 });
      }
    }

    return new Response(JSON.stringify(password), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

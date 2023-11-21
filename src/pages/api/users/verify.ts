import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { parseError } from "@api/helpers/response";
import error from "@utils/errors";
import {
  createUser,
  getVerificationData,
  wrongVerificationCode,
} from "@db/user";

export const post: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
      throw new Error(undefined, { cause: 401 });
    }

    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { postedCode, userEmail } = (await request.json()) as {
      postedCode: string;
      userEmail: string;
    };

    const verificationData = await getVerificationData(userEmail);

    if (!verificationData) {
      throw new Error(undefined, { cause: 404 });
    }

    const { code, password, rateLimit } = verificationData;

    if (String(code) === postedCode) {
      await createUser(userEmail, password as string);
    } else {
      await wrongVerificationCode(userEmail, (rateLimit as number) + 1);

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

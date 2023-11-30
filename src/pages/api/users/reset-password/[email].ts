import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { parseError } from "@api/helpers/response";
import {
  changePassword,
  getUserByEmail,
  getpasswordResetCode,
  initPasswordReset,
  wrongPasswordCode,
} from "@db/user";
import sendResetCode from "@utils/email";
import errors from "@utils/errors";

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

    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error(errors.WRONG_EMAIL, { cause: 400 });
    }

    const code = await initPasswordReset(email);
    await sendResetCode(email, { code }, "reset-password");

    return new Response(JSON.stringify(null), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

export const post: APIRoute = async ({ request, params }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      throw new Error(undefined, { cause: 400 });
    }

    const { code, password } = (await request.json()) as {
      code: string;
      password: string;
    };

    const { email } = params as {
      email: string;
    };

    const user = await getUserByEmail(email);

    if (!email || !code || !password || !user) {
      throw new Error(undefined, { cause: 404 });
    }

    const { code: sessionCode, rateLimit } = await getpasswordResetCode(email);

    if (code === sessionCode) {
      const passwordChanged = await changePassword(email, password);

      if (!passwordChanged) {
        throw new Error(undefined, { cause: 500 });
      }
    } else {
      await wrongPasswordCode(email, (rateLimit as number) + 1);

      if ((rateLimit as number) === 2) {
        throw new Error(errors.VERIFICATION_CODE_EXPIRED, { cause: 400 });
      } else {
        throw new Error(errors.WRONG_VERIFICATION_CODE, { cause: 400 });
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

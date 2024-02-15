import {
  createUserIdentity,
  getUserIdentities,
  getUserIdentitiesCount,
} from "@db/identity";
import { entityEnum } from "@utils/constants";
import { DATA_TYPE } from "@utils/urlParams";
import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { z } from "astro:content";

export const GET: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const userId = session?.user?.id;

    const urlParams = new URL(request.url).searchParams;
    const dataType = urlParams.get(DATA_TYPE) ?? undefined;
    const dataTypeFilter =
      dataType && Object.values(entityEnum).includes(dataType as entityEnum)
        ? dataType
        : undefined;

    const [identities, count] = await Promise.all([
      getUserIdentities(userId as string, dataTypeFilter as entityEnum),
      getUserIdentitiesCount(userId as string),
    ]);

    return new Response(
      JSON.stringify({
        identities,
        count,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const userId = session.user?.id;
    const identity = await request.json();
    await createUserIdentity({ ...identity, userId });

    return new Response(JSON.stringify(null), { status: 200, headers });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors.map(({ message, path }) => [
        message,
        path[path.length - 1],
      ]);

      return new Response(JSON.stringify(errors), {
        status: 400,
        headers,
      });
    }

    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

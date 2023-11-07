import {
  createUserIdentity,
  getUserIdentities,
  getUserIdentitiesCount,
} from "@db/identity";
import { entityEnum } from "@utils/constants";
import { DATA_TYPE } from "@utils/urlParams";
import type { APIRoute } from "astro";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { z } from "astro:content";

export const get: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const userId = session?.user?.id;

  const urlParams = new URL(request.url).searchParams;
  const dataType = urlParams.get(DATA_TYPE) ?? undefined;
  const dataTypeFilter = entityEnum.includes(
    dataType as (typeof entityEnum)[number]
  )
    ? dataType
    : undefined;

  try {
    const [identities, count] = await Promise.all([
      getUserIdentities(
        userId as string,
        dataTypeFilter as (typeof entityEnum)[number]
      ),
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
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

export const post: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const userId = session.user?.id;

  try {
    const identity = await request.json();
    await createUserIdentity({ ...identity, userId });

    return new Response(JSON.stringify(null), { status: 200, headers });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors: string[] = [];

      e.errors.map(({ message }) => errors.push(message));

      return new Response(JSON.stringify(errors), {
        status: 400,
        headers,
      });
    } else {
      return new Response(JSON.stringify(null), { status: 400, headers });
    }
  }
};

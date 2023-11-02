import { getUserIdentities, getUserIdentitiesCount } from "@db/identity";
import { entityEnum } from "@utils/constants";
import { DATA_TYPE } from "@utils/urlParams";
import type { APIRoute } from "astro";
import { UUID } from "mongodb";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const session = await getSession(request);
  const userId = session?.user?.id;

  if (!userId || !UUID.isValid(userId)) {
    return new Response(null, { status: 401 });
  }

  const urlParams = new URL(request.url).searchParams;
  const dataType = urlParams.get(DATA_TYPE) ?? undefined;
  const dataTypeFilter = entityEnum.includes(
    dataType as (typeof entityEnum)[number]
  )
    ? dataType
    : undefined;

  try {
    const [identities, count] = await Promise.all([
      getUserIdentities(userId, dataTypeFilter as (typeof entityEnum)[number]),
      getUserIdentitiesCount(userId),
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
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

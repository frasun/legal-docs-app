import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import {
  deleteUserIdentity,
  getUserIdentity,
  updateUserIdentity,
} from "@db/identity";
import { UUID } from "mongodb";
import { responseHeaders as headers } from "@api/helpers/response";
import { z } from "astro:content";

export const get: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { identityId } = params;

  if (!UUID.isValid(identityId as string)) {
    return new Response(JSON.stringify(null), { status: 404, headers });
  }

  try {
    const identity = await getUserIdentity(
      identityId as string,
      session.user?.id as string
    );

    if (!identity) {
      return new Response(JSON.stringify(null), { status: 403, headers });
    }

    return new Response(JSON.stringify(identity), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify(e instanceof Error ? e.message : null), {
      status: 500,
      headers,
    });
  }
};

export const all: APIRoute = async ({ request, params }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(JSON.stringify(null), { status: 401, headers });
  }

  const { identityId } = params;
  const userId = session.user?.id;

  if (request.method === "DELETE") {
    try {
      const response = await deleteUserIdentity(
        identityId as string,
        userId as string
      );

      if (response.deletedCount === 1) {
        return new Response(JSON.stringify(null), { status: 200, headers });
      } else {
        return new Response(JSON.stringify(null), { status: 404, headers });
      }
    } catch (e) {
      return new Response(
        JSON.stringify(e instanceof Error ? e.message : null),
        {
          status: 500,
          headers,
        }
      );
    }
  }

  if (request.method === "PUT") {
    try {
      const identity = await request.json();
      const response = await updateUserIdentity(
        identityId as string,
        userId as string,
        identity
      );

      if (response.modifiedCount !== 1) {
        return new Response(JSON.stringify(null), { status: 404, headers });
      }

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
        return new Response(
          JSON.stringify(e instanceof Error ? e.message : null),
          {
            status: 500,
            headers,
          }
        );
      }
    }
  }

  return new Response(JSON.stringify(null), { status: 400, headers });
};

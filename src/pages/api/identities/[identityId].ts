import { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import {
  deleteUserIdentity,
  getUserIdentity,
  updateUserIdentity,
} from "@db/identity";
import { UUID } from "mongodb";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { z } from "astro:content";

export const get: APIRoute = async ({ request, params }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const { identityId } = params;

    if (!UUID.isValid(identityId as string)) {
      throw new Error(undefined, { cause: 404 });
    }

    const identity = await getUserIdentity(
      identityId as string,
      session.user?.id as string
    );

    if (!identity) {
      throw new Error(undefined, { cause: 403 });
    }

    return new Response(JSON.stringify(identity), { status: 200, headers });
  } catch (e) {
    const { message, status } = parseError(e);
    return new Response(JSON.stringify(message), {
      status,
      headers,
    });
  }
};

export const all: APIRoute = async ({ request, params }) => {
  try {
    const session = await getSession(request);

    if (!session) {
      throw new Error(undefined, { cause: 401 });
    }

    const { identityId } = params;
    const userId = session.user?.id;

    if (request.method === "DELETE") {
      const response = await deleteUserIdentity(
        identityId as string,
        userId as string
      );

      if (!response.deletedCount) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    }

    if (request.method === "PUT") {
      const identity = await request.json();
      const response = await updateUserIdentity(
        identityId as string,
        userId as string,
        identity
      );

      if (!response.modifiedCount) {
        throw new Error(undefined, { cause: 404 });
      }

      return new Response(JSON.stringify(null), { status: 200, headers });
    }

    throw new Error(undefined, { cause: 400 });
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

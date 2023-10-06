import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Post } from "@type";

export const get: APIRoute = async ({ request, params }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const session = await getSession(request);
  const isAdmin = session?.user?.role === UserRoles.admin;

  const postQuery = `_type == "post" && slug.current == $slug`;
  const adminQuery = isAdmin
    ? postQuery
    : `${postQuery} && defined(publishedAt)`;

  const post: Post = await sanityClient.fetch(
    `*[${adminQuery}] {
        title, 
        publishedAt, 
        body, 
        mainImage, 
        "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
        keywords,
        description,
        memberContent,
        "documents": documents[]->{
          title, 
          slug
        }
      }[0]`,
    {
      slug: params.slug,
    }
  );

  if (!post) {
    return new Response(null, { status: 404 });
  }

  const { memberContent } = post;

  if (!session && memberContent) {
    return new Response(null, {
      status: 401,
    });
  }

  return new Response(JSON.stringify(post), {
    status: 200,
  });
};

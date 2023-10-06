import type { APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";
//@ts-ignore
import { sanityClient } from "sanity:client";
import type { Post } from "@type";
import { PAGE, LIMIT } from "@utils/urlParams";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const session = await getSession(request);
  const isAdmin = session?.user?.role === UserRoles.admin;

  try {
    const urlParams = new URL(request.url).searchParams;
    const page = Number(urlParams.get(PAGE)) || 1;
    const limit = Number(urlParams.get(LIMIT)) || 10;
    const hidePublished = urlParams.get("showPublished") === "false" ?? false;

    const adminQuery =
      isAdmin && !hidePublished
        ? `_type == "post"`
        : `_type == "post" && defined(publishedAt)`;
    const postQuery = session
      ? adminQuery
      : `${adminQuery} && memberContent == false`;

    const postCount = await sanityClient.fetch(`count(*[${postQuery}])`);
    const pages = Math.ceil(postCount / limit);
    const currentPage = page <= pages ? page : 1;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = currentPage * limit;
    const queryOrder = isAdmin ? `_updatedAt` : `publishedAt`;
    const posts: Post[] = await sanityClient.fetch(
      `*[${postQuery}] | order(${queryOrder} desc) [${startIndex}...${endIndex}] { 
          title, 
          publishedAt, 
          slug, 
          mainImage,
          "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
      }`
    );

    return new Response(
      JSON.stringify({
        posts,
        pages,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 500 });
  }
};

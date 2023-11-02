import type { APIRoute } from "astro";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { getPrices } from "@utils/stripe";
import { getDocuments } from "src/api/helpers/documents";
import { responseHeaders as headers } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const session = await getSession(request);
  const urlParams = new URL(request.url).searchParams;
  const category = urlParams.get(CATEGORY);
  const search = urlParams.get(SEARCH);
  const showDarft = session?.user?.role === UserRoles.admin;
  const showMemberContent = Boolean(session);

  try {
    const [documents, prices] = await Promise.all([
      getDocuments(showDarft, showMemberContent, category, search),
      getPrices(),
    ]);

    const documentsWithPrices = documents.map((document) => {
      const {
        slug,
        data: { title, priceId, categories, draft },
      } = document;
      const priceObj = prices.find((price) => price.id === priceId);

      if (priceObj) {
        return {
          title,
          slug,
          price: priceObj.unit_amount ? priceObj.unit_amount / 100 : 0,
          draft,
          categories: categories.map(({ id }) => id),
        };
      }
    });

    return new Response(JSON.stringify(documentsWithPrices), {
      status: 200,
      headers,
    });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

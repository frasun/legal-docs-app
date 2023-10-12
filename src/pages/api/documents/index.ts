import type { APIRoute } from "astro";
import { CATEGORY, SEARCH, DRAFT, MEMBER_CONTENT } from "@utils/urlParams";
import { getPrices } from "@utils/stripe";
import { getDocuments } from "src/api/helpers/documents";

export const get: APIRoute = async ({ request }) => {
  if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
    return new Response(null, { status: 401 });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get(CATEGORY);
  const search = url.searchParams.get(SEARCH);
  const draft = url.searchParams.get(DRAFT);
  const memberContent = url.searchParams.get(MEMBER_CONTENT);

  const showDarft = draft === "true";
  const showMemberContent = memberContent === "true";

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

    return new Response(JSON.stringify(documentsWithPrices), { status: 200 });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : null, { status: 500 });
  }
};

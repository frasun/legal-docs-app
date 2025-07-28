import type { APIRoute } from "astro";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { getPrices } from "@utils/stripe";
import { getTemplates } from "@api/helpers/templates";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getSession } from "auth-astro/server";
import { UserRoles } from "@db/user";

export const GET: APIRoute = async ({ request, cookies }) => {
	try {
		// if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
		//   throw new Error(undefined, { cause: 401 });
		// }

		const SESSION_COOKIE = "pr-ssid";
		if (!cookies.has(SESSION_COOKIE)) {
			throw new Error(undefined, { cause: 401 });
		}

		const session = await getSession(request);
		const urlParams = new URL(request.url).searchParams;
		const category = urlParams.get(CATEGORY);
		const search = urlParams.get(SEARCH);
		const showDarft = session?.user?.role === UserRoles.admin;
		const showMemberContent = Boolean(session);
		const [documents, prices] = await Promise.all([
			getTemplates(showDarft, showMemberContent, category, search),
			getPrices(),
		]);

		const documentsWithPrices = documents.map((document) => {
			const { slug, title, priceId, categories, draft } = document;
			const priceObj = prices.find((price) => price.id === priceId);

			return {
				title,
				slug,
				price:
					priceObj && priceObj.unit_amount ? priceObj.unit_amount / 100 : 0,
				draft,
				categories: categories ? categories.map(({ slug }) => slug) : [],
			};
		});

		return new Response(JSON.stringify(documentsWithPrices), {
			status: 200,
			headers,
		});
	} catch (e) {
		const { message, status } = parseError(e);
		return new Response(JSON.stringify(message), {
			status,
			headers,
		});
	}
};

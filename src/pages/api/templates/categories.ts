import type { APIRoute } from "astro";
import { responseHeaders as headers, parseError } from "@api/helpers/response";
import { getCategories } from "@api/helpers/templates";

export const GET: APIRoute = async ({ request }) => {
	try {
		// if (request.headers.get("x-api-key") !== import.meta.env.API_KEY) {
		// 	throw new Error(undefined, { cause: 401 });
		// }

		const categories = await getCategories();

		return new Response(JSON.stringify(categories), {
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

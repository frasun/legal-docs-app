import { CATEGORY, SEARCH } from "@utils/urlParams";
import type { DocumentCategory, TemplateShort } from "@type";
import { displayError } from "@stores/toast";

interface fetchProps {
	category?: string;
	search?: string;
	categoryList?: DocumentCategory[];
	limit?: number;
}

const getCategoryName = (slug: string, categoryList: DocumentCategory[]) => {
	const ct = categoryList.find(({ slug: id }) => id === slug);

	return ct ? ct.title.toLowerCase() : "";
};

const getCategoryList = (
	docCategories: string[],
	categoryList: DocumentCategory[]
) =>
	docCategories
		.sort((a, b) => a.localeCompare(b))
		.map((id) => getCategoryName(id, categoryList));

const mapTemplateData = (
	templates: TemplateShort[],
	categoryList: DocumentCategory[]
) =>
	categoryList
		? templates.map((template) => ({
				...template,
				categories: getCategoryList(template.categories, categoryList),
			}))
		: templates;

/**
 * Fetch document templates
 */
const fetchTemplates = async ({
	category,
	search,
	categoryList = [],
	limit,
}: fetchProps) => {
	const requestUrl = new URL("/api/templates", document.location.origin);

	if (category) {
		requestUrl.searchParams.append(CATEGORY, category);
	}

	if (search) {
		requestUrl.searchParams.append(SEARCH, search);
	}

	return new Promise<TemplateShort[]>(async (resolve, reject) => {
		try {
			const response = await fetch(requestUrl);
			const templates: TemplateShort[] = await response.json();
			const templatesToUse = limit
				? shuffle(templates).slice(0, limit)
				: templates;

			resolve(mapTemplateData(templatesToUse, categoryList));
		} catch {
			reject();
		}
	});
};

function shuffle(array: any[]) {
	return array.sort(() => Math.random() - 0.5);
}

export default fetchTemplates;

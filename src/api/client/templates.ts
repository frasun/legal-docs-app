import { CATEGORY, SEARCH } from "@utils/urlParams";
import type { DocumentCategory, TemplateShort } from "@type";

interface fetchProps {
	category?: string;
	search?: string;
	categoryList: DocumentCategory[];
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
	categoryList,
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

			if (!templates.length) reject();

			resolve(mapTemplateData(templates, categoryList));
		} catch {
			// @todo: Show toast.
			console.log("request error");
		}
	});
};

export default fetchTemplates;

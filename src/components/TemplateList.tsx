import { useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import EmptyScreen from "@components/EmptyScreen/emptyScreen";
import Loading from "@components/Loading";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { navigate } from "astro:transitions/client";
import routes from "@utils/routes";

interface fetchProps {
	aborted?: boolean;
	category?: string;
	search?: string;
}

interface Props {
	categories: DocumentCategory[];
	search?: string;
	category?: string;
}

const EMPTY_TEXT = "Brak dokumentów do wyświetlenia";

export default ({ categories: categoryList, search, category }: Props) => {
	const [templates, setTemplates] = useState<TemplateShort[]>([]);
	const [loading, setLoading] = useState(true);

	const getCategoryName = (slug: string) => {
		const ct = categoryList.find(({ slug: id }) => id === slug);

		return ct ? ct.title.toLowerCase() : "";
	};

	const getCategoryList = (docCategories: string[]) =>
		docCategories
			.sort((a, b) => a.localeCompare(b))
			.map((id) => getCategoryName(id));

	const mapTemplateData = (
		templates: TemplateShort[],
		categoryList: DocumentCategory[]
	) =>
		categoryList
			? templates.map((template) => ({
					...template,
					categories: getCategoryList(template.categories),
				}))
			: templates;

	/**
	 * Fetch document templates
	 */
	const fetchTemplates = async ({ category, search }: fetchProps) => {
		const requestUrl = new URL("/api/templates", document.location.origin);

		if (category) {
			requestUrl.searchParams.append(CATEGORY, category);
		}

		if (search) {
			requestUrl.searchParams.append(SEARCH, search);
		}

		setLoading(true);

		try {
			const response = await fetch(requestUrl);
			const templates: TemplateShort[] = await response.json();
			const mappedTemplates = mapTemplateData(templates, categoryList);

			setTemplates(mappedTemplates);
		} catch {
			navigate(routes.NOT_FOUND);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Fetch data on mount
	 */
	useEffect(() => {
		fetchTemplates({ search, category });
	}, []);

	return (
		<>
			{loading ? (
				<Loading />
			) : templates.length ? (
				<TemplateGrid templates={templates} />
			) : (
				<EmptyScreen>{EMPTY_TEXT}</EmptyScreen>
			)}
		</>
	);
};

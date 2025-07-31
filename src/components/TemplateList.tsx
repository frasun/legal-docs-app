import { useEffect, useRef, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import EmptyScreen from "@components/EmptyScreen/emptyScreen";
import Loading from "@components/Loading";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import TemplateCategorySelector from "./TemplateCategorySelector";
import TemplateSearch from "./TemplateSearch";

interface fetchProps {
	aborted?: boolean;
	category?: string;
	search?: string;
}

const EMPTY_TEXT = "Brak dokumentów do wyświetlenia";
const PAGE_TITLE = "Wszystkie dokumenty";

export default () => {
	const [templates, setTemplates] = useState<TemplateShort[]>([]);
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<DocumentCategory[]>([]);
	const [search, setSearch] = useState("");
	const [currentCat, setCurrentCat] = useState<string>();
	const [title, setTitle] = useState<string>();

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

			setTemplates(templates);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Fetch template categories
	 */
	const fetchCategories = async () => {
		try {
			const response = await fetch(
				new URL(`/api/templates/categories`, document.location.origin)
			);
			const categories: DocumentCategory[] = await response.json();

			setCategories(categories);
		} catch {}
	};

	/**
	 * Fetch data on mount
	 */
	useEffect(() => {
		/** Collect params from the url */
		const url = new URL(document.location.href);
		const search = url.searchParams.get(SEARCH) || undefined;
		const category = url.searchParams.get(CATEGORY) || undefined;

		if (search) {
			setSearch(search);
		}

		if (category) {
			setCurrentCat(category);
		}

		/** Fetch data */
		fetchTemplates({ search, category });
		fetchCategories();
	}, []);

	useEffect(() => {
		const currentCategory = categories.find(({ slug }) => slug === currentCat);
		const title = currentCategory
			? `Dokumenty w kategorii ${currentCategory.title.toLowerCase()}`
			: PAGE_TITLE;

		setTitle(title);
	}, [categories, currentCat]);

	/**
	 * Fetch templates on category change
	 */
	const fetchCategory = async (category: DocumentCategory["slug"]) => {
		setCurrentCat(category);
		await fetchTemplates({
			category,
			search: search || undefined,
		});
	};

	/**
	 * Fetch templates on search change
	 */
	const fetchSearch = async (searchQuery: DocumentCategory["title"]) => {
		if (searchQuery === search) return;

		setSearch(searchQuery);
		await fetchTemplates({
			category: currentCat || undefined,
			search: searchQuery,
		});
	};

	return (
		<>
			<header>
				<h1>{title}</h1>
			</header>
			<TemplateSearch search={search} onSearchChange={fetchSearch} />
			<TemplateCategorySelector
				categories={categories}
				onCategoryChange={fetchCategory}
				selectedCategory={currentCat}
			/>
			{loading ? (
				<Loading />
			) : templates.length ? (
				<>
					<TemplateGrid templates={templates} />
				</>
			) : (
				<EmptyScreen>{EMPTY_TEXT}</EmptyScreen>
			)}
		</>
	);
};

import { Suspense, useDeferredValue, useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import Loading from "@components/Loading";
import { ErrorBoundary } from "react-error-boundary";
import fetchTemplates from "@api/client/templates";
import { useStore } from "@nanostores/react";
import { $templateSearch } from "@stores/searchTemplates";
import Error from "@components/Error";

interface Props {
	/** A collection of category data */
	categories: DocumentCategory[];
	/** Current search query */
	search?: string;
	/** Selected category */
	category?: string;
}

export default ({ categories: categoryList, search, category }: Props) => {
	const [templates, setTemplates] = useState<Promise<TemplateShort[]>>();
	const deferredTemplates = useDeferredValue(templates);
	const searchQuery = useStore($templateSearch);
	const isFetching = deferredTemplates !== templates;

	useEffect(() => {
		const query = "string" === typeof searchQuery ? searchQuery : search;

		setTemplates(fetchTemplates({ category, search: query, categoryList }));
	}, [searchQuery]);

	return deferredTemplates ? (
		<ErrorBoundary FallbackComponent={Error}>
			<Suspense fallback={<Loading />}>
				<TemplateGrid
					templatesPromise={deferredTemplates}
					style={{ opacity: isFetching ? 0.5 : 1 }}
				/>
			</Suspense>
		</ErrorBoundary>
	) : (
		<></>
	);
};
